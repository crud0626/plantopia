const nicknameRe = /^[가-힣ㄱ-ㅎa-zA-Z0-9 ]{2,8}$/;
const koreanRe = /[ㄱ-ㅎ|가-힣|]/;
const emailRe =
  /^[A-Za-z0-9]([-_.]?[A-Za-z0-9])*@[A-Za-z0-9]([-_.]?[A-Za-z0-9])*\.[A-Za-z]{2,3}$/;
const passwordRe = /^[A-Za-z0-9]{8,20}$/;

export { nicknameRe, koreanRe, emailRe, passwordRe };
