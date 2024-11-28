자바스크립트로 웹 서버를 만들고 mySql과 통신하는 과정을 연습하는 프로젝트입니다.

- express를 사용해 서버 구현
- router를 사용해 서버 api 구현
- 쿠키 기능 구현
- 쿠키를 jwt로 암호화 및 복호화
- 민감한 내용을 .env파일에 은닉
- 민감한 내용을 bcrypt로 암호화 및 복호화
- 쿠키를 통해 로그인 세션 유지
- prisma를 사용해 mySql 스키마 구현
- prisma를 사용해 mySql 데이터베이스와 연동
- insomnia를 사용해 http request 테스트

서버 기능
- http 메시지를 통해 서버 api에 접근
- post /api/item : 아이템 생성
- get /api/item : 아이템 목록 조회
- get /api/item/:itemId : 아이템 상세 조회
- put /api/item/:itemId : 아이템 정보 수정
- delete /api/item/:itemId : 아이템 삭제

- post /api/character : 캐릭터 생성
- delete /api/character/:charId : 캐릭터 삭제
- get /api/character/:charId : 캐릭터 조회

- post /api/sign-up : 회원가입
- post /api/sign-in : 로그인
- get /api/user : 유저 정보 조회

암호화 방식
- 회원가입시 req.body로 password를 전달받으면 bcrypt로 단방향 암호화 후 데이터베이스에 저장
- 로그인시 전달받은 password를 bcrypt로 변환한 내용과 데이터베이스에 저장된 내용과 비교
- 이렇게 하면 데이터베이스가 해킹당해도 암호화된 내용이 저장되어있기 때문에 안전하다
인증 방식
- 만약 jwt를 사용하지 않고 access token이 노출되었을 경우 사용자가 임의로 토큰을 수정할 수 있다
- jwt에서는 header, payload 외에도 signiture를 두어 검증 절차를 거친기 때문에 토큰이 임의로 수정되는 것을 방지할 수 있다
인증과 인가
- 인증은 사용자가 인증된 사람인지 검증하는 것, 인가는 인증된 사용자가 특정 리소스에 접근하거나 특정 작업을 수행할 수 있는 권한이 있는지 검증하는 것
- 이 프로젝트에는 아이템 관련 api에 인증이 필요치 않지만, 실제로는 무엇보다 인증이 필요하다. 왜냐하면 아이템 데이터베이스는 서버 관리자만이 접근하고 작업할 수 있는 공간이기 때문이다.
HTTP Status Code
- 200 : 정상 작동함
- 201 : 정상적으로 데이터를 생성함
- 400 : 사용자가 잘못함
- 401 : 인증되지 않은 사용자
- 403 : 인가되지 않은 사용자
- 404 : 리소스를 찾을 수 없음
- 409 : 요청이 서버의 상태와 충돌함
게임 경제
- 간편한 구성을 위해 캐릭터 테이블에 money라는 컬럼을 추가하였다. 이럴 경우 어떤 문제가 있을까?

어려웠던 점
- prisma schema 구현이 익숙치 않았다.
- prisma method 구현이 익숙치 않았다.
- 자바스크립트가 자료형이 명시되지 않아서 자료형을 자꾸 틀렸다.
- 캐릭터 조회할 때 prisma.findFirst를 두 번 호출하는데, 이걸 줄일 수 있는 방법이 없을까?
- router 메서드 정의는 크게 어렵지 않았다.