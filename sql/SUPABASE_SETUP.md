# Supabase 데이터베이스 설정 가이드

## 📋 개요

이 SQL 스크립트는 React Todo 앱의 Supabase 데이터베이스를 설정합니다.

## 🚀 실행 방법

### 방법 1: Supabase Dashboard에서 실행

1. [Supabase Dashboard](https://app.supabase.com) 접속
2. 프로젝트 선택
3. 왼쪽 메뉴에서 **SQL Editor** 선택
4. **New Query** 클릭
5. `supabase-setup.sql` 파일의 내용을 복사해서 붙여넣기
6. **Run** 버튼 클릭

### 방법 2: Supabase CLI 사용

```bash
# Supabase CLI 설치 (미설치 시)
npm install -g supabase

# 로그인
supabase login

# 프로젝트 링크
supabase link --project-ref your-project-ref

# SQL 실행
supabase db push
```

## 📊 데이터베이스 구조

### 1. `public.users` 테이블

| 컬럼      | 타입      | 설명                             |
| --------- | --------- | -------------------------------- |
| id        | UUID      | Primary Key (auth.users.id 참조) |
| email     | TEXT      | 이메일 (유니크)                  |
| createdAt | TIMESTAMP | 생성일                           |
| updatedAt | TIMESTAMP | 수정일                           |

### 2. `public.todos` 테이블

| 컬럼      | 타입      | 설명                      |
| --------- | --------- | ------------------------- |
| id        | UUID      | Primary Key               |
| userId    | UUID      | 사용자 ID (users.id 참조) |
| contents  | TEXT      | 할 일 내용                |
| isDone    | BOOLEAN   | 완료 여부                 |
| pinned    | BOOLEAN   | 고정 여부                 |
| createdAt | TIMESTAMP | 생성일                    |
| updatedAt | TIMESTAMP | 수정일                    |

## 🔐 주요 기능

### 자동 사용자 생성

- `auth.users`에 새 사용자가 생성되면 자동으로 `public.users`에도 추가됩니다
- 트리거 함수 `handle_new_user()`가 자동 실행됩니다

### Row Level Security (RLS)

모든 테이블에 RLS가 활성화되어 있습니다:

#### users 테이블 정책

- ✅ 사용자는 자신의 프로필만 조회 가능
- ✅ 사용자는 자신의 프로필만 수정 가능
- ✅ 사용자는 자신의 프로필 생성 가능

#### todos 테이블 정책

- ✅ 사용자는 자신의 todos만 조회 가능
- ✅ 사용자는 자신의 todos만 생성 가능
- ✅ 사용자는 자신의 todos만 수정 가능
- ✅ 사용자는 자신의 todos만 삭제 가능

### 자동 업데이트

- `updated_at` 필드는 레코드 수정 시 자동으로 현재 시간으로 업데이트됩니다

## 🔍 확인 방법

SQL Editor에서 다음 쿼리로 확인:

```sql
-- 테이블 존재 확인
SELECT table_name
FROM information_schema.tables
WHERE table_schema = 'public';

-- RLS 정책 확인
SELECT schemaname, tablename, policyname
FROM pg_policies
WHERE schemaname = 'public';

-- 트리거 확인
SELECT trigger_name, event_object_table
FROM information_schema.triggers
WHERE trigger_schema = 'public';
```

## ⚠️ 주의사항

1. **기존 데이터**: 이 스크립트는 `IF NOT EXISTS`를 사용하므로 기존 테이블이 있으면 건너뜁니다
2. **정책 재생성**: `DROP POLICY IF EXISTS`를 사용하여 기존 정책을 삭제하고 새로 생성합니다
3. **데이터 백업**: 운영 환경에서는 실행 전 반드시 데이터를 백업하세요

## 🧪 테스트

회원가입 후 확인:

```sql
-- auth.users에서 사용자 확인
SELECT id, email FROM auth.users;

-- public.users에도 자동 생성되었는지 확인
SELECT id, email FROM public.users;
```

## 📝 TypeScript 타입 업데이트

`src/@types/todos.ts` 파일의 타입을 데이터베이스 스키마와 맞추세요:

```typescript
export interface User {
  id: string;
  email: string;
  createdAt: string;
  updatedAt: string;
}

export interface Todo {
  id: string;
  userId: string;
  contents: string;
  isDone: boolean;
  pinned?: boolean;
  createdAt: string;
  updatedAt: string;
}
```
