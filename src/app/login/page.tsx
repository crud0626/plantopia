import { getProviders } from 'next-auth/react';
import SocialBtn from './SocialBtn';
import LoginForm from './LoginForm';
import styles from './page.module.scss';

export default async function LoginPage() {
  const providers = (await getProviders()) || [];

  return (
    <>
      <main className={styles.container}>
        <div className={`${styles.login_box} inner`}>
          <h1>
            <span>Plantopia</span>
          </h1>
          <h2 className={styles.sub_title}>
            <div>
              간편하게 로그인하고
              <br />
              <em>다양한 서비스를 이용하세요.</em>
            </div>
          </h2>
          <LoginForm />
          <div className={styles.oauth_box}>
            <p>SNS 계정으로 로그인하기</p>
            {Object.values(providers).map(provider => (
              <SocialBtn key={provider.name} provider={provider} />
            ))}
          </div>
        </div>
      </main>
    </>
  );
}
