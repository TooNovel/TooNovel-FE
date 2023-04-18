<template>
  <div class="footer-dark">
    <footer>
      <div class="container">
        <div class="row">
          <div class="col-sm-6 col-md-3 item">
            <h3>장르</h3>
            <ul>
              <li><a href="#">로맨스</a></li>
              <li><a href="#">로판</a></li>
              <li><a href="#">판타지</a></li>
              <li><a href="#">현판</a></li>
              <li><a href="#">무협</a></li>
              <li><a href="#">미스테리</a></li>
              <li><a href="#">역사</a></li>
              <li><a href="#">SF</a></li>
            </ul>
          </div>
          <div class="col-sm-6 col-md-3 item">
            <h3>기타</h3>
            <ul>
              <li><a href="#">작품찾기</a></li>
              <li><a href="#">커뮤니티</a></li>
              <li><a href="#">팬클럽</a></li>
            </ul>
          </div>
          <div class="col-sm-6 col-md-3 item">
            <h3>계정</h3>
            <ul>
              <li>
                <a href="#">로그인</a>
              </li>
              <li><a href="#">회원가입</a></li>
            </ul>
          </div>
          <div class="col item social">
            <a><b-icon-instagram></b-icon-instagram></a>
            <a><b-icon-facebook></b-icon-facebook></a>
            <a><b-icon-twitter></b-icon-twitter></a>
          </div>
        </div>
        <p class="copyright">
          감성과 이야기가 어우러지는 투노벨, 작가와 독자의 새로운 만남 © 2023
        </p>
      </div>
    </footer>
  </div>
</template>
<script>
export default {};
</script>

<style scoped>
.footer-dark {
  padding: 50px 0;
}

.footer-dark h3 {
  margin-top: 0;
  margin-bottom: 12px;
  font-weight: bold;
  font-size: 16px;
}

.footer-dark ul {
  padding: 0;
  list-style: none;
  line-height: 1.6;
  font-size: 14px;
  margin-bottom: 0;
}

.footer-dark ul a {
  color: inherit;
  text-decoration: none;
  opacity: 0.6;
}

.footer-dark ul a:hover {
  opacity: 0.8;
}

@media (max-width: 767px) {
  .footer-dark .item:not(.social) {
    text-align: center;
    padding-bottom: 20px;
  }
}

.footer-dark .item.text {
  margin-bottom: 36px;
}

@media (max-width: 767px) {
  .footer-dark .item.text {
    margin-bottom: 0;
  }
}

.footer-dark .item.text p {
  opacity: 0.6;
  margin-bottom: 0;
}

.footer-dark .item.social {
  text-align: center;
}

@media (max-width: 991px) {
  .footer-dark .item.social {
    text-align: center;
    margin-top: 20px;
  }
}

.footer-dark .item.social > a {
  font-size: 30px;
  width: 36px;
  height: 36px;
  line-height: 36px;
  display: inline-block;
  text-align: center;
  border-radius: 50%;
  margin: 0 8px;
  opacity: 0.75;
}

.footer-dark .item.social > a:hover {
  opacity: 0.9;
}

.footer-dark .copyright {
  text-align: center;
  padding-top: 24px;
  opacity: 0.3;
  font-size: 17px;
  margin-bottom: 0;
}
</style>
