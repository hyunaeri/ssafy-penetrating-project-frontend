# YumYumCoach Frontend

배달 코칭 서비스 **YumYumCoach**의 프론트엔드입니다.  
Next.js App Router와 FSD(Feature-Sliced Design) 구조로 모바일 우선 UI를 제공합니다.

## 기술 스택

- **Next.js 15** (App Router)
- **React 19**
- **TypeScript**
- **Tailwind CSS**
- **react-hook-form** — 회원가입 폼
- **react-daum-postcode** — 주소 검색(다음 우편번호)
- **pnpm** — 패키지 매니저

## 시작하기

### 사전 요구 사항

- Node.js 18 이상 권장 (프로젝트는 Node 22 기준으로 개발됨)
- [pnpm](https://pnpm.io/) 10.12.1

`package.json`에 `packageManager`가 지정되어 있습니다. pnpm이 없다면 아래 중 하나로 설치하세요.

```bash
# 전역 설치
npm install -g pnpm@10.12.1

# 또는 Corepack (관리자 권한이 필요할 수 있음)
corepack enable
corepack prepare pnpm@10.12.1 --activate
```

설치 후 터미널을 다시 열고 버전을 확인합니다.

```bash
pnpm --version
```

### 의존성 설치

프로젝트 루트(`frontend/`)에서 실행합니다.

```bash
pnpm install
```

### 개발 서버 실행

```bash
pnpm dev
```

브라우저에서 [http://localhost:3000](http://localhost:3000) 으로 접속합니다.

### 기타 스크립트

| 명령어 | 설명 |
|--------|------|
| `pnpm dev` | 개발 서버 (핫 리로드) |
| `pnpm build` | 프로덕션 빌드 |
| `pnpm start` | 빌드 결과물 실행 (`build` 이후) |
| `pnpm lint` | ESLint 검사 |

### 환경 변수

루트에 `.env.local` 파일을 두고 백엔드 서버 주소를 설정합니다.  
템플릿은 `.env.example` 을 복사해 사용하면 됩니다.

```bash
cp .env.example .env.local
```

```env
# 서버 사이드(BFF·API Route)에서 사용
BACKEND_URL=http://localhost:8080

# 클라이언트에서 백엔드 origin이 필요할 때
NEXT_PUBLIC_API_URL=http://localhost:8080
```

로컬에서 **백엔드(Spring)와 프론트(Next)를 함께** 띄운 뒤 로그인·회원가입·마이페이지를 확인하는 것을 권장합니다.

---

## 화면 및 기능

### 라우트 개요

| 경로 | 설명 | 로그인 필요 |
|------|------|-------------|
| `/` | 토큰 유무에 따라 `/main` 또는 `/login`으로 이동 | — |
| `/login` | 소셜 로그인 화면 | ✗ |
| `/oauth/callback` | OAuth 완료 후 토큰 저장·메인 이동 | ✗ |
| `/signup` | OAuth 후 추가 회원가입 | ✗ (`signupToken` 쿼리 필요) |
| `/main` | 메인(배달 카테고리) | ✓ |
| `/favorite` | 찜 (준비 중) | ✓ |
| `/catalog` | 음식 도감 (준비 중) | ✓ |
| `/orders` | 주문 이력 (준비 중) | ✓ |
| `/profile` | 내 정보(마이페이지) | ✓ |

`(app)` 그룹 하위 페이지는 **AppShell**이 액세스 토큰을 확인합니다. 없으면 `/login`으로 보냅니다.

---

### 로그인 (`/login`)

- Google 계정으로 로그인하는 버튼 제공
- 처음 이용 시 백엔드 흐름에 따라 회원가입 화면으로 안내될 수 있음
- 이용약관·개인정보 안내 문구 표시

### OAuth 콜백 (`/oauth/callback`)

- URL의 `accessToken`을 읽어 **localStorage**에 저장
- 저장 후 메인(`/main`)으로 이동
- 토큰이 없거나 처리 실패 시 로그인 화면으로 되돌림

### 회원가입 (`/signup`)

OAuth 인증만 끝난 사용자가 **추가 정보**를 입력하는 화면입니다.

- **URL**: `?signupToken=...` (JWT). 토큰이 없거나 잘못되면 로그인으로 이동
- **표시 정보**: OAuth에서 받은 프로필 사진, 닉네임, 이메일, 로그인 제공자(Google 등)
- **입력 항목**
  - 연락처 (휴대폰 번호, 형식 검증)
  - 주소 (다음 우편번호 검색 모달)
  - 역할: 주문 고객 / 매장 사장 / 라이더
- 가입 완료 시 액세스 토큰 저장 후 메인으로 이동

관련 코드: `widgets/signup-form`, `features/auth/signup`, `features/role-picker`

### 메인 (`/main`)

- 배달 **카테고리 그리드** (프랜차이즈, 치킨, 피자/양식 등 10종)
- `public/images/` 카테고리 일러스트 사용
- 스크롤 시 **맨 위로** 버튼 표시

관련 코드: `features/category-grid`

### 마이페이지 (`/profile`)

로그인한 사용자 정보를 조회해 표시합니다.

- 프로필 사진 (없으면 닉네임 첫 글자 아바타)
- 이름(닉네임), 이메일
- 연락처, 주소, 로그인 방식, 역할
- 값이 비어 있으면 `등록된 정보가 없습니다` 표시
- **로그아웃** — 토큰 삭제 후 로그인 화면으로 이동

관련 코드: `features/profile`, `entities/user`, `entities/session`

### 하단 네비게이션

메인·찜·도감·주문 이력·내 정보 탭. 현재 경로에 따라 활성 탭 강조.

관련 코드: `widgets/bottom-nav`, `widgets/app-shell`

### 준비 중 화면

`/favorite`, `/catalog`, `/orders` 는 레이아웃과 제목만 있는 **플레이스홀더**입니다. 이후 기능 연동 예정.

---

## 인증(프론트 관점)

- **액세스 토큰**: 브라우저 `localStorage` 키 `accessToken`
- **저장 시점**: OAuth 콜백, 회원가입 완료
- **삭제 시점**: 로그아웃
- **사용처**: 앱 탭 레이아웃 진입 가드, 마이페이지 사용자 조회, 로그아웃 요청 시 Authorization 헤더

클라이언트는 same-origin의 Next **API Route**(`/api/...`)를 호출하고, 서버 라우트가 백엔드와 통신합니다. (엔드포인트 상세는 이 문서에서 다루지 않습니다.)

---

## 프로젝트 구조 (FSD)

```
src/
├── app/              # Next.js 라우트·레이아웃·API Route
│   ├── (app)/        # 로그인 필요 탭 (main, profile, …)
│   ├── login/
│   ├── signup/
│   └── oauth/callback/
├── widgets/          # 페이지 단위 UI 조립 (AppShell, SignupForm, BottomNav)
├── features/         # 기능 단위 UI·훅 (auth, category-grid, profile, …)
├── entities/         # 도메인 (user, session, category)
└── shared/           # 공용 UI·유틸 (MobileShell, PrimaryButton, api)
```

### 레이어 import 규칙

- `features` → `entities`, `shared`
- `widgets` → `features`, `entities`, `shared`
- `app` → `widgets`, `features`, `entities`, `shared`

FSD와 App Router 역할 분리에 대한 보충 설명은 [`src/README.md`](./src/README.md)를 참고하세요.

---

## UI·디자인

- **모바일 폭**: `max-w-mobile` 중심 레이아웃
- **공통 셸**: `MobileShell` — 로그인·회원가입 등 단일 컬럼 화면
- **앱 셸**: `AppShell` — 하단 탭 + 콘텐츠 영역
- **색·타이포**: Tailwind 커스텀 토큰 (`ink`, `muted`, `line`, `surface` 등, `globals.css` / `tailwind.config.ts`)

---

## 주요 의존 기능 모듈

| 모듈 | 용도 |
|------|------|
| `entities/session` | 액세스 토큰 read/write/clear |
| `entities/user` | 사용자 타입, 회원가입·조회·로그아웃, OAuth 토큰 파싱, 라벨 포맷 |
| `entities/category` | 메인 카테고리 목록·이미지 경로 |
| `features/auth/google-login` | Google 로그인 버튼 |
| `features/auth/signup` | 회원가입 폼·주소 검색·제출 |
| `features/category-grid` | 메인 카테고리 UI |
| `features/profile` | 마이페이지 조회·표시 |
| `shared/ui` | `MobileShell`, `PrimaryButton` |

---

## 트러블슈팅

### `pnpm` 명령을 찾을 수 없음

전역 설치 후 **터미널/IDE를 재시작**하세요. 그래도 안 되면 `npm install -g pnpm@10.12.1` 을 다시 실행합니다.

### `pnpm install` 후 이미지 관련 경고

`sharp` 등 빌드 스크립트 무시 경고가 나오면, 이미지 최적화가 필요할 때 `pnpm approve-builds` 로 허용할 수 있습니다.

### Next.js 워크스페이스 경고

상위 폴더에 다른 `package-lock.json`이 있으면 루트 추론 경고가 날 수 있습니다. `frontend` 폴더에서만 작업하거나, 필요 시 `next.config.ts`에 `outputFileTracingRoot`를 설정합니다.
