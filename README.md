# icanagi - AI 서비스 마켓플레이스 🤖

Next.js 14, Prisma, PostgreSQL로 구축된 AI/AGI/Agent 솔루션 통합 포털입니다.

## ✨ 주요 기능

- 🎨 **미니멀 테크 디자인** - 다크 모드 기반의 현대적인 UI/UX
- 🔐 **소셜 로그인** - Google 및 Kakao OAuth 연동
- 👤 **역할 기반 접근 제어** - USER/ADMIN 권한 관리
- 📦 **상품 관리 시스템** - CRUD 기능 완비
- 🖼️ **이미지 업로드** - Cloudinary 통합
- 📝 **Markdown 에디터** - 풍부한 상품 설명 작성
- 🏷️ **태그 시스템** - 유연한 상품 분류
- 📊 **통계 추적** - 조회수, 클릭수 자동 집계
- 🚀 **SEO 최적화** - 메타데이터, slug 자동 생성

## 🛠️ 기술 스택

| 구분 | 기술 |
|------|------|
| **Frontend** | Next.js 14 (App Router), TypeScript, Tailwind CSS |
| **Backend** | Next.js Server Actions |
| **Database** | PostgreSQL + Prisma ORM |
| **Authentication** | NextAuth.js (Google, Kakao) |
| **Image Storage** | Cloudinary |
| **UI Components** | Lucide React, react-hook-form, zod |

## 📋 사전 요구사항

- Node.js 18.17 이상
- PostgreSQL 데이터베이스 (또는 Supabase, Neon 등)
- Cloudinary 계정 (무료)
- Google OAuth 클라이언트 ID (선택사항)
- Kakao REST API 키 (선택사항)

## 🚀 시작하기

### 1. 레포지토리 클론 및 의존성 설치

```bash
# 의존성 설치
npm install
```

### 2. 환경 변수 설정
Supabase 계정 비호 : sinmyungican
`.env` 파일을 생성하고 아래 값들을 입력하세요:

```env
# PostgreSQL 데이터베이스
DATABASE_URL="postgresql://username:password@localhost:5432/icanagi?schema=public"

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-here"  # openssl rand -base64 32

# Google OAuth (선택)
GOOGLE_CLIENT_ID="your-client-id"
GOOGLE_CLIENT_SECRET="your-client-secret"

# Kakao OAuth (선택)
KAKAO_CLIENT_ID="your-rest-api-key"
KAKAO_CLIENT_SECRET="your-client-secret"

# Cloudinary
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME="your-cloud-name"
CLOUDINARY_API_KEY="your-api-key"
CLOUDINARY_API_SECRET="your-api-secret"
NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET="icanagi_products"

# 관리자 이메일
ADMIN_EMAILS="admin@example.com"
```

### 3. 데이터베이스 설정

```bash
# Prisma 클라이언트 생성
npx prisma generate

# 데이터베이스 마이그레이션
npx prisma migrate dev --name init

# Prisma Studio로 데이터 확인 (선택사항)
npx prisma studio
```

### 4. 개발 서버 실행

```bash
npm run dev
```

브라우저에서 [http://localhost:3000](http://localhost:3000)을 열어주세요.

## 📖 OAuth 설정 가이드

### Google OAuth

1. [Google Cloud Console](https://console.cloud.google.com/)에 접속
2. 새 프로젝트 생성 또는 기존 프로젝트 선택
3. "API 및 서비스" > "사용자 인증 정보" 이동
4. "사용자 인증 정보 만들기" > "OAuth 클라이언트 ID"
5. 승인된 리디렉션 URI 추가:
   - `http://localhost:3000/api/auth/callback/google`
6. 클라이언트 ID와 시크릿을 `.env`에 복사

### Kakao OAuth

1. [Kakao Developers](https://developers.kakao.com/)에 접속
2. 애플리케이션 추가
3. "앱 설정" > "플랫폼" > "Web 플랫폼 등록"
   - 사이트 도메인: `http://localhost:3000`
4. "제품 설정" > "카카오 로그인" 활성화
5. Redirect URI 등록:
   - `http://localhost:3000/api/auth/callback/kakao`
6. REST API 키와 Client Secret을 `.env`에 복사

### Cloudinary 설정

1. [Cloudinary](https://cloudinary.com/)에서 무료 가입
2. Dashboard에서 Cloud name, API Key, API Secret 확인
3. Settings > Upload > Upload presets
4. "Add upload preset" 클릭
   - Preset name: `icanagi_products`
   - Signing Mode: **Unsigned**
5. 값들을 `.env`에 복사

## 📁 프로젝트 구조

```
icanagi/
├── app/
│   ├── admin/
│   │   └── products/          # 관리자 상품 관리
│   ├── api/
│   │   └── auth/              # NextAuth API
│   ├── products/              # 상품 상세 페이지
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx
├── components/
│   ├── AuthButton.tsx         # 로그인/로그아웃 버튼
│   ├── ImageUpload.tsx        # 이미지 업로드 위젯
│   ├── Navbar.tsx             # 네비게이션 바
│   ├── ProductCard.tsx        # 상품 카드
│   └── Providers.tsx          # NextAuth Provider
├── lib/
│   ├── actions/
│   │   └── product.actions.ts # 상품 CRUD Server Actions
│   ├── auth.ts                # 인증 헬퍼 함수
│   ├── cloudinary.ts          # Cloudinary 유틸리티
│   ├── prisma.ts              # Prisma 클라이언트
│   └── utils.ts               # 공통 유틸리티
├── prisma/
│   └── schema.prisma          # 데이터베이스 스키마
└── types/
    └── next-auth.d.ts         # NextAuth 타입 확장
```

## 🎯 사용 방법

### 1. 관리자 계정 설정

`.env` 파일의 `ADMIN_EMAILS`에 본인의 이메일을 추가하세요. 해당 이메일로 로그인하면 자동으로 ADMIN 권한이 부여됩니다.

### 2. 첫 상품 등록

1. Google 또는 Kakao로 로그인
2. 우측 상단의 "관리자" 메뉴 클릭
3. "새 상품 등록" 버튼 클릭
4. 상품 정보 입력 및 이미지 업로드
5. "상품 등록" 클릭

### 3. 메인 페이지에서 확인

홈으로 돌아가면 등록한 상품이 표시됩니다.

## 📝 주요 기능 설명

### 상품 관리 (CRUD)

- **생성**: 관리자 페이지에서 모든 정보 입력
- **조회**: 메인 페이지, 카테고리 필터링, 검색 (준비 중)
- **수정**: 상품 카드 클릭 → 수정 (준비 중)
- **삭제**: 관리자가 카드의 X 버튼 클릭

### 상품 상태

- **DRAFT**: 임시저장 (메인 페이지 미표시)
- **PUBLISHED**: 공개 (메인 페이지 표시)
- **ARCHIVED**: 보관됨 (준비 중)

### 태그 시스템

쉼표로 구분하여 여러 태그 추가 가능:
```
AI, 챗봇, 자동화, NLP
```

## 🔧 개발

### 데이터베이스 스키마 변경

```bash
# 스키마 수정 후
npx prisma migrate dev --name your_migration_name

# Prisma Client 재생성
npx prisma generate
```

### 프로덕션 빌드

```bash
npm run build
npm run start
```

### 코드 린팅

```bash
npm run lint
```

## 🚀 배포

### Vercel (권장)

1. GitHub 레포지토리에 푸시
2. [Vercel](https://vercel.com/)에서 Import
3. 환경 변수 설정
4. 배포!

### 주의사항

- `NEXTAUTH_URL`을 프로덕션 도메인으로 변경
- OAuth Redirect URI를 프로덕션 도메인으로 업데이트
- `NEXTAUTH_SECRET`을 새로 생성

## 📌 다음 단계 (개선 계획)

- [ ] 상품 상세 페이지 구현
- [ ] 상품 수정 기능
- [ ] 카테고리별 필터링 UI
- [ ] 검색 기능
- [ ] 페이지네이션
- [ ] 상품 리뷰/평점 시스템
- [ ] 분석 대시보드
- [ ] 다국어 지원 (i18n)
- [ ] 이메일 알림

## 📄 라이선스

MIT License

## 🙋‍♂️ 문의

프로젝트 관련 문의사항이 있으시면 이슈를 생성해주세요.

---

Made with ❤️ using Next.js 14
