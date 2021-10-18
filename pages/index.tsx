import type { NextPage } from 'next'
import { useState } from 'react'

const Home: NextPage = () => {

  const [login, setLogin] = useState('teste');
  const [password, setPassword] = useState('');
  const [msgErro, setMsgErro] = useState('');
  const [isLoading, setLoading] = useState(false);

  const doLogin = async(e : any) =>{
    try{
      setLoading(true);
      e.preventDefault();
      setMsgErro('')

      if(!login || !password){
        setMsgErro('Parâmetros de entrada inválidos');
        setTimeout(() => {
        setLoading(false)
        }, 2000)
        return;
      }
    }catch(e){
      console.log(e);
    }

    setLoading(false);
}

  return (
    <div className="container-login">
      <img src="/logo.svg" alt="Logo Fiap" className="logo"/>
      <form>
        {msgErro && <p>{msgErro}</p>}
        <div className="input">
          <img src="/mail.svg" alt="Logo Fiap"/>
          <input type="text" placeholder="example@example.com" 
           value={login} onChange={e => setLogin(e.target.value)} />
        </div>
        <div className="input">
          <img src="/lock.svg" alt="Logo Fiap"/>
          <input type="password" placeholder="Informe sua senha" 
          value={password} onChange={e => setPassword(e.target.value)}/>
        </div>
        <button className={isLoading ? "disabled" : ""} type="button" onClick={doLogin} disabled={isLoading}>{isLoading ? "...Carregando" : "Login"}</button>
      </form>
    </div>
  )
}

export default Home
