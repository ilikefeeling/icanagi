# Product Requirement Document (PRD): AI Service Marketplace & Portal

## 1. 프로젝트 개요 (Project Overview)
서비스명 : icanagi
- **프로젝트명:** AI/AGI/Agent 통합 서비스 포털 및 상품 관리 시스템
- **목표:** 자사가 개발한 AI 솔루션을 상품화하여 게시하고, 관리자 대시보드를 통해 실시간으로 상품을 등록, 수정, 삭제할 수 있는 비즈니스 플랫폼 구축.
- **핵심 가치:** 전문성 있는 상품 전시, 통합 회원 관리, 유연한 상품 콘텐츠 관리.

## 2. 핵심 기능 요구사항 (Functional Requirements)

### 2.1 상품 관리 시스템 (Product CMS)
- **개요:** 관리자가 코드 수정 없이 웹 UI를 통해 상품을 직접 제어.
- **상세 기능:**
    - **상품 등록:** 상품명, 카테고리(AI/SaaS/Agent), 썸네일 이미지, 서비스 URL, Markdown 기반 상세 설명 입력.
    - **상품 리스트 조회:** 등록된 모든 상품의 상태(게시/임시저장) 확인.
    - **상품 삭제:** 불필요한 상품 데이터 및 이미지 자산의 즉각적인 삭제 처리.

### 2.2 상품 카탈로그 및 상세 페이지 (Showcase)
- **개요:** 사용자에게 상품의 가치를 제안하고 이용을 유도하는 화면.
- **상세 기능:**
    - **그리드 레이아웃:** 카드 형태의 상품 리스트 (필터링 및 검색 기능 포함).
    - **상세 설명 섹션:** AI 도구의 구동 방식, API 명세, 데모 영상 등 심층 정보 제공.
    - **CTA 연동:** '바로 시작하기' 또는 '데모 신청' 등 서비스별 전환 버튼.

### 2.3 통합 인증 및 보안 (Auth & Security)
- **개요:** 일반 사용자 및 관리자 접근 권한 분리.
- **상세 기능:**
    - **관리자 전용 접근:** 상품 등록/삭제 메뉴는 특정 관리자 계정(Google Auth 기반)으로만 접근 가능.
    - **사용자 계정 DB:** 회원 정보를 PostgreSQL에 저장하여 서비스 간 사용자 데이터 연동 준비.

## 3. 디자인 요구사항 (Design & Interface)

### 3.1 비주얼 컨셉: 미니멀 테크 (Minimal Tech)
- **배경:** 다크 모드(Deep Navy/Black) 기반의 현대적인 감각.
- **포인트:** 일렉트릭 블루 또는 민트 컬러를 사용하여 AI 에이전트의 스마트한 느낌 강조.

### 3.2 UI 구성
- **Home:** 최신 및 인기 AI 상품을 배치한 히어로 섹션.
- **Admin Dashboard:** 데이터 입력에 최적화된 테이블 및 폼 레이아웃 (Clean White 또는 Dark Gray).
- **Responsive:** 모바일 환경에서도 상품 카드가 적절히 배열되는 반응형 디자인.

## 4. 기술 스택 (Technical Stack)

| 구분 | 기술 스택 | 비고 |
| :--- | :--- | :--- |
| **Frontend** | Next.js 14+ (App Router) | SEO 최적화 및 빠른 페이지 로딩 |
| **Styling** | Tailwind CSS | 일관된 테크니컬 UI 구현 |
| **Backend** | Server Actions (Next.js) | 별도의 API 서버 없이 빠른 CRUD 구현 |
| **Database** | PostgreSQL + Prisma | 안정적인 데이터 관리 및 ORM 활용 |
| **Storage** | AWS S3 / Cloudinary | 상품 이미지 및 동영상 에셋 저장 |
| **Auth** | NextAuth.js | 관리자 권한 및 소셜 로그인 연동 |

## 5. 데이터 구조 설계 (Data Schema)
- **Product Table:** id, name, description, category, thumbnail_url, service_url, status, created_at, updated_at.
- **User Table:** id, email, role (ADMIN/USER), provider, created_at.

## 6. 단계별 로드맵 (Roadmap)
1. **1단계:** DB 스키마 설계 및 Prisma 마이그레이션.
2. **2단계:** 관리자 페이지 구축 (상품 등록 및 삭제 로직 완성).
3. **3단계:** 메인 페이지 및 상품 상세 정보 UI 구현.
4. **4단계:** 이미지 업로드 연동 및 최종 배포.