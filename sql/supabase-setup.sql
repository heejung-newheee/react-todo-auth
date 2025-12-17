-- ============================================
-- 1. users 테이블 생성
-- ============================================
CREATE TABLE IF NOT EXISTS public.users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- 2. todos 테이블 생성
-- ============================================
CREATE TABLE IF NOT EXISTS public.todos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "userId" UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  contents TEXT NOT NULL,
  "isDone" BOOLEAN DEFAULT FALSE,
  "pinned" BOOLEAN DEFAULT FALSE,
  "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- 3. 인덱스 생성 (성능 최적화)
-- ============================================
CREATE INDEX IF NOT EXISTS idx_todos_user_id ON public.todos("userId");
CREATE INDEX IF NOT EXISTS idx_todos_created_at ON public.todos("createdAt" DESC);

-- ============================================
-- 4. auth.users 생성 시 자동으로 public.users에 추가하는 트리거 함수
-- ============================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, email, "createdAt", "updatedAt")
  VALUES (NEW.id, NEW.email, NOW(), NOW());
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================
-- 5. 트리거 생성
-- ============================================
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- ============================================
-- 6. RLS (Row Level Security) 활성화
-- ============================================
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.todos ENABLE ROW LEVEL SECURITY;

-- ============================================
-- 7. users 테이블 RLS 정책
-- ============================================
-- 자신의 정보만 조회 가능
DROP POLICY IF EXISTS "Users can view their own profile" ON public.users;
CREATE POLICY "Users can view their own profile"
  ON public.users
  FOR SELECT
  USING (auth.uid() = id);

-- 자신의 정보만 수정 가능
DROP POLICY IF EXISTS "Users can update their own profile" ON public.users;
CREATE POLICY "Users can update their own profile"
  ON public.users
  FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- 누구나 자신의 프로필 삽입 가능 (트리거가 자동으로 하지만, 혹시 모를 경우 대비)
DROP POLICY IF EXISTS "Users can insert their own profile" ON public.users;
CREATE POLICY "Users can insert their own profile"
  ON public.users
  FOR INSERT
  WITH CHECK (auth.uid() = id);

-- ============================================
-- 8. todos 테이블 RLS 정책
-- ============================================
-- 자신의 todos만 조회 가능
DROP POLICY IF EXISTS "Users can view their own todos" ON public.todos;
CREATE POLICY "Users can view their own todos"
  ON public.todos
  FOR SELECT
  USING (auth.uid() = "userId");

-- 자신의 todos만 생성 가능
DROP POLICY IF EXISTS "Users can create their own todos" ON public.todos;
CREATE POLICY "Users can create their own todos"
  ON public.todos
  FOR INSERT
  WITH CHECK (auth.uid() = "userId");

-- 자신의 todos만 수정 가능
DROP POLICY IF EXISTS "Users can update their own todos" ON public.todos;
CREATE POLICY "Users can update their own todos"
  ON public.todos
  FOR UPDATE
  USING (auth.uid() = "userId")
  WITH CHECK (auth.uid() = "userId");

-- 자신의 todos만 삭제 가능
DROP POLICY IF EXISTS "Users can delete their own todos" ON public.todos;
CREATE POLICY "Users can delete their own todos"
  ON public.todos
  FOR DELETE
  USING (auth.uid() = "userId");

-- ============================================
-- 9. updated_at 자동 업데이트 트리거 함수
-- ============================================
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW."updatedAt" = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- users 테이블에 적용
DROP TRIGGER IF EXISTS set_updated_at_users ON public.users;
CREATE TRIGGER set_updated_at_users
  BEFORE UPDATE ON public.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

-- todos 테이블에 적용
DROP TRIGGER IF EXISTS set_updated_at_todos ON public.todos;
CREATE TRIGGER set_updated_at_todos
  BEFORE UPDATE ON public.todos
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();
