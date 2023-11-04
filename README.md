# Plantopia

![메인사진](https://github.com/crud0626/plantopia/assets/72868495/d4de97c9-55ce-4bf9-b40d-d6b8bd21fbb0)

<div align='center'>
   식물집사를 위한 식물 관리 꿀팁을 제공하고 내 식물의 돌봄 기록과 물 주는 일자를 알려주는 식물관리 서비스입니다.
   <br>
   <br>
   <a href="https://plant-utopia-refactor.vercel.app/">🌻 Plantopia 링크</a>
</div>
<br>
<div align='center'>
   
||테스트 계정|
|---|---|
|ID| test@test.com |
|PW| test1234 |

</div>

## 사용 기술

<div align='center'>
  <img src="https://img.shields.io/badge/TypeScript-^5.0.2-3178C6?logo=typescript&logoColor=white" />
  <img src="https://img.shields.io/badge/React-^18.2.0-61DAFB?logo=react" />
  <img src="https://img.shields.io/badge/React_Router-^6.15.0-CA4245?logo=reactrouter&logoColor=white" />
  <img src="https://img.shields.io/badge/SCSS-^1.65.1-CC6699?logo=sass&logoColor=white" />
  <img src="https://img.shields.io/badge/Axios-^1.4.0-5A29E4?logo=axios" />
  <img src="https://img.shields.io/badge/Swiper-^10.2.0-6332F6?logo=swiper&logoColor=white" />
</div>
<div align='center'>
  <img src="https://img.shields.io/badge/Vite-^4.4.5-646CFF?logo=vite" />
  <img src="https://img.shields.io/badge/Firebase-^10.2.0-FFCA28?logo=firebase&logoColor=white" />
   <img src="https://img.shields.io/badge/ESLint-^8.45.0-4B32C3?logo=eslint&logoColor=white" />
   <img src="https://img.shields.io/badge/Prettier-^3.0.1-F7B93E?logo=prettier&logoColor=white" />
  <img src="https://img.shields.io/badge/Figma-F24E1E?logo=figma&logoColor=white" />
</div>
<br>

### 참고 링크
* [피그마 디자인](https://www.figma.com/file/RUhI3WEt58FPy2lTQgxcZ1/%5BPlantopia%5D-%EB%94%94%EC%9E%90%EC%9D%B8?type=design&node-id=0%3A1&mode=design&t=7BwIsIrp3J0oiMCw-1)
* [화면 흐름도](https://www.figma.com/file/IbS394tB0XjfNyyEUlZr9U/%5BPlantopia%5D-%ED%99%94%EB%A9%B4-%ED%9D%90%EB%A6%84%EB%8F%84?type=whiteboard&t=7BwIsIrp3J0oiMCw-1)

## 폴더 구조

```
src
├─ @types # 재사용되는 타입들을 저장하며 "a.type.ts" 와 같은 파일 네이밍 컨벤션 사용
├─ api # API 관련 로직
├─ assets  # 폰트, 아이콘, 이미지와 같은 정적 자원
│  ├─ fonts
│  ├─ icons
│  └─ images
├─ components # 재사용되는 컴포넌트
├─ constants  # 상수화가 필요한 변수
├─ hooks # 커스텀 훅
├─ pages # 재사용되지 않는 컴포넌트 (하위 폴더는 페이지 단위 구분)
├─ routes  # React-router의 라우팅 관련 코드
├─ styles  #  GlobalStyle, Mixins, 재사용되는 스타일 관련 변수 등
└─ utils  # 재사용되는 유틸 함수
```

## 기능

### 메인 페이지

<div align=center>
   
|<img width="250" src="https://github.com/crud0626/plantopia/assets/72868495/4018949f-c432-45de-9e0e-3ec1e566292d" />|
|---|

</div>

* 자신이 등록한 식물들의 리스트를 보여주며 메인에 나타나있는 식물의 간단한 정보 (마지막으로 물 준 날, 처음 함께한 날, 다음 물주기 날까지 남은 디데이) 를 확인할 수 있습니다.
* 현재 보고 있는 식물의 이미지 옆에 물주기 버튼을 클릭하여 특정 식물에게 물을 준 날짜를 기록할 수 있으며 이미지 클릭시 상세 페이지로 이동하게 됩니다.
* Geolocation API를 활용하여 사용자의 위치정보를 받아 해당 지역의 날씨 정보를 받아올 수 있으며 메인 페이지 상단에 날씨에 대한 정보(사용자의 위치, 날씨 이미지, 날씨, 온도, 날씨에 맞는 텍스트)를 보여줍니다.

---

### 캘린더 페이지

<div align=center>
   
|<img width="250" src="https://github.com/crud0626/plantopia/assets/72868495/e1504c72-1244-46ca-ac7a-d1dfa26268cc" />|
|---|

</div>

* 사용자가 어떤 날짜에 어떤 식물에게 물을 주었는지 시각적으로 확인할 수 있는 페이지입니다.

---

### 로그인 페이지

<div align=center>
   
|<img width="250" src="https://github.com/crud0626/plantopia/assets/72868495/9dad1a96-b54a-40a4-b4a0-1be9790dc055" />|
|---|

</div>


* 이메일 로그인과 소셜 로그인 기능을 구현하였으며 사용자는 로그인하지 않았을 경우 항상 로그인 페이지로 이동됩니다.
* "비밀번호를 잃어버리셨나요?" 버튼을 통해 이메일 입력시 가입여부 확인 후 비밀번호 재설정 메일이 전송됩니다.
* "가입하기" 버튼을 통해 회원가입 페이지로 이동할 수 있습니다.

---

### 식물도감 페이지

<div align=center>
   
|<img width="250" src="https://github.com/crud0626/plantopia/assets/72868495/384dcb9a-7bbb-4b3c-b421-54a5568e4752" />|
|---|

</div>


* 사용자가 궁금하거나 찾고자하는 식물을 검색해 찾을 수 있는 페이지로 식물에 대한 정보(종, 분류, 습도, 관리 수준, 병해충)와 식물이 자라기 좋은 환경(일조량, 수분량, 생육적정온도)에 대한 정보를 제공합니다.
* 식물도감 메인페이지에서는 다양한 카테고리별 (식린이를 위한, 빨리 성장하는 식물, 수분량이 적은 식물, 일조량이 적은 식물) 식물을 슬라이드로 형태로 추천해줍니다.
* 또한, 유저의 사용성을 고려해 해당 식물의 상세보기 탭에 내 식물로 바로 추가할 수 있는 버튼을 추가하였습니다.

---

### 다이어리 페이지

<div align=center>
   
|<img width="250" src="https://github.com/crud0626/plantopia/assets/72868495/b7bb1ad5-003a-4d68-9f2c-cd103e4bf22d" />|
|---|

</div>

* 사용자가 식물에 대한 일기 혹은 기록이 필요한 경우 활용할 수 있는 다이어리입니다.
* 사진과 함께 다이어리를 작성, 수정, 삭제할 수 있으며 특정 식물 혹은 여러개의 식물을 태그할 수 있습니다.
* 다이어리의 메인 페이지는 게시글 형태로 보기, 갤러리 형태로 보기 두 가지 형태를 지원합니다.

---

### 내 식물 페이지

<div align=center>
   
|<img width="250" src="https://github.com/crud0626/plantopia/assets/72868495/c1d221b0-3af7-4aaf-b5f5-4b715207aa30" />|
|---|

</div>


* 사용자의 식물을 관리할 수 있는 페이지입니다.
* 북마크 버튼을 통해 사용자의 메인 식물을 변경할 수 있으며 메인 식물로 설정한 경우 메인페이지에 접근할 때 해당 식물이 메인에 노출됩니다.
* 해당 페이지에서 사용자는 식물 등록, 수정, 삭제를 할 수 있습니다.
* 해당 페이지의 상세페이지에서는 식물 도감에서 볼 수 있는 식물에 대한 다양한 정보와 메인페이지에서 볼 수 있는 정보를 확인할 수 있습니다.

---
### 마이 페이지

<div align=center>
   
|<img width="250" src="https://github.com/crud0626/plantopia/assets/72868495/3d6ac90f-7984-4be4-bb87-aac06186d3fd" />|
|---|

</div>

* 사용자가 자신에 대한 정보를 확인하고 수정할 수 있는 페이지입니다.
* PWA로 사용하는 방법과 자주 묻는 질문, 식물 추가 요청 구글 폼, 로그아웃 등의 기능이 포함되어 있습니다.
