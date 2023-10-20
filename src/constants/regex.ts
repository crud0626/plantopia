const nicknamePattern = /^[가-힣ㄱ-ㅎa-zA-Z0-9 ]{2,8}$/;
const koreanPattern = /[ㄱ-ㅎ|가-힣|]/;
const emailPattern =
  /^[A-Za-z0-9]([-_.]?[A-Za-z0-9])*@[A-Za-z0-9]([-_.]?[A-Za-z0-9])*\.[A-Za-z]{2,3}$/;
const passwordPattern = /^[A-Za-z0-9]{8,20}$/;

export { nicknamePattern, koreanPattern, emailPattern, passwordPattern };
