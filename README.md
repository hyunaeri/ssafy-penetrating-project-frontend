# Whik, 휙 (게이미피케이션을 접목한 배달 플랫폼)

주문·배달 경험에 **업적·쿠폰·도감** 같은 게이미피케이션 요소를 더한 배달 서비스 **Whik(휙)** 의 프론트엔드입니다.  
모바일 우선 UI로 고객 주문, 사장님 매장 운영, 관리자 보상 설계까지 한 앱에서 이어집니다.

| 환경 | 주소 |
|------|------|
| **프론트 (배포)** | [https://www.whik.store](https://www.whik.store) |
| **백엔드 API** | `https://api.whik.store` |
| **로컬 개발** | [http://localhost:3000](http://localhost:3000) |

---

## 주요 기능

### 고객

| 기능 | 설명 |
|------|------|
| **Google 로그인 · 회원가입** | OAuth2 로그인 후 역할(고객/사장) 선택 및 추가 정보 입력 |
| **매장 탐색** | 카테고리별 매장 목록, 평점·배달시간·최소주문금액 확인 |
| **매장 상세 · 메뉴** | 메뉴 이미지·옵션 확인 후 장바구니 담기 (타 매장 담기 시 안내) |
| **찜** | 관심 매장 저장 및 목록에서 빠르게 재방문 |
| **장바구니** | 배달/픽업 선택, 수량 조절, 결제 예정 금액 확인 |
| **토스페이먼츠 결제** | 결제 준비 → 결제창 → 성공/실패 처리 |
| **주문 추적** | Kakao Maps 기반 실시간 배달 경로·단계별 상태(접수·조리·배달 등) |
| **주문 내역** | 과거 주문 조회 |
| **실시간 알림 (SSE)** | 주문 상태, 업적 달성, 쿠폰 발급 등 푸시형 토스트 |
| **내 정보** | 프로필 확인 · 로그아웃 |
| **도감** | 먹어본 메뉴 수집 UI (준비 중) |

### 사장님

| 기능 | 설명 |
|------|------|
| **매장 등록 · 수정** | 매장명, 주소, 소개, 대표 이미지 관리 |
| **메뉴 CRUD** | 메뉴 등록·수정·삭제, 이미지·가격·품절 처리 |
| **주문 관리** | 들어온 주문 확인 및 상태 변경 |
| **실시간 알림** | 신규 주문·상태 변경 SSE 수신 |

### 관리자 (게이미피케이션 운영)

| 기능 | 설명 |
|------|------|
| **업적 관리** | 업적 생성·수정·삭제, 등급(NORMAL~LEGENDARY), 달성 조건 설정 |
| **달성 조건 유형** | 단일 주문 태그, 주문 시간대, 연속 태그 주문, 태그별 누적 금액 등 |
| **보상 연동** | 업적 달성 시 지급할 쿠폰 연결 |
| **쿠폰 관리** | 할인 쿠폰 생성·수정·삭제, 할인율·유효기간·이미지 설정 |

### 인증 · 세션

- **Refresh Token**: HttpOnly 쿠키로 관리, Access Token은 메모리(Zustand)에만 보관
- **세션 복구**: 새로고침 시 `api.whik.store/api/v1/auth/reissue`로 토큰 재발급 (CORS + 쿠키)
- **역할 가드**: 고객 / 사장 / 관리자 Shell 분리

---

## 기술 스택

- **Framework**: Next.js 15 (App Router), React 19, TypeScript
- **Styling**: Tailwind CSS
- **State**: Zustand, TanStack Query
- **결제**: Toss Payments SDK
- **지도**: Kakao Maps SDK · 모빌리티 길찾기 API
- **실시간**: Server-Sent Events (`@microsoft/fetch-event-source`)
- **패키지 매니저**: pnpm 10.12.1

---

## 시작하기

### 사전 요구 사항

- Node.js 18 이상
- [pnpm](https://pnpm.io/) 10.12.1

```bash
npm install -g pnpm@10.12.1
# 또는: corepack enable && corepack prepare pnpm@10.12.1 --activate
```

### 설치 및 실행

```bash
pnpm install
pnpm dev
```

로컬: [http://localhost:3000](http://localhost:3000)  
배포: [https://www.whik.store](https://www.whik.store)

| 명령어 | 설명 |
|--------|------|
| `pnpm dev` | 개발 서버 |
| `pnpm build` | 프로덕션 빌드 |
| `pnpm start` | 빌드 결과 실행 |
| `pnpm lint` | ESLint |

로컬에서는 **백엔드(Spring, `:8080`)와 프론트를 함께** 실행한 뒤 이용합니다.

### 환경 변수

프로젝트 루트에 `.env.local`을 생성합니다.

**로컬**

```env
BACKEND_URL=http://localhost:8080
NEXT_PUBLIC_API_URL=http://localhost:8080

NEXT_PUBLIC_TOSS_SDK_URL=https://js.tosspayments.com/v2/standard
NEXT_PUBLIC_TOSS_CLIENT_KEY=your_toss_client_key

NEXT_PUBLIC_KAKAO_MAP_APP_KEY=your_kakao_map_app_key
KAKAO_REST_API_KEY=your_kakao_rest_api_key
```

**배포 (Vercel 등)**

```env
BACKEND_URL=https://api.whik.store
NEXT_PUBLIC_API_URL=https://api.whik.store
# + Toss, Kakao 키 동일하게 설정
```

프론트 API는 `/api/*` Next.js Route Handler가 `BACKEND_URL`로 프록시합니다.  
**reissue · signup · logout** 은 refreshToken 쿠키가 `api` 도메인에 저장되므로 브라우저가 `NEXT_PUBLIC_API_URL`로 직접 호출합니다.  
OAuth 시작만 `/api/login/oauth/google` 프록시를 통해 백엔드로 리다이렉트합니다.

---

## 화면 구성

### 고객 (`/main` 하단 탭)

| 탭 | 경로 | 설명 |
|----|------|------|
| 홈 | `/main` | 카테고리 · 매장 탐색 |
| 찜 | `/favorite` | 찜한 매장 |
| 도감 | `/catalog` | 음식 도감 (준비 중) |
| 주문내역 | `/orders` | 주문 이력 |
| 내 정보 | `/profile` | 프로필 |

기타: `/categories/[id]` · `/stores/[id]` · `/cart` · `/payment/*` · `/orders/[id]/tracking`

### 사장님 (`/owner`)

`/owner` · `/owner/store` · `/owner/orders` · `/owner/notifications` · `/owner/profile`

### 관리자 (`/admin`)

`/admin/login` · `/admin/achievements` · `/admin/coupons`

---

## UI

- 모바일 폭(`max-w-mobile`) 중심 레이아웃
- 로그인·회원가입: 단일 컬럼 셸
- 로그인 후: 역할별 Shell + 하단 탭(고객) / 전용 네비(사장·관리자)

---

## 트러블슈팅

### `pnpm` 명령을 찾을 수 없음

전역 설치 후 터미널·IDE를 재시작하세요.

### 로그인 후 `reissue` 500 (배포)

- Vercel `NEXT_PUBLIC_API_URL=https://api.whik.store` 설정 확인
- Network 탭에서 `reissue` 요청이 **`api.whik.store`** 로 가는지 확인 (www 프록시가 아님)
- 백엔드 CORS에 `https://www.whik.store` 포함 여부 확인

### `pnpm install` 시 Corepack 오류

`npm install -g pnpm`으로 설치하거나 Node·Corepack을 최신으로 맞춥니다.
