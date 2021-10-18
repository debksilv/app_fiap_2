import type { NextPage } from 'next'
import { useState } from 'react'
import { executeRequest } from '../services/api';
import { AccessTokenProps } from '../types/AccessTokenProps';

const Login: NextPage <AccessTokenProps> = ({
  setAccessToken
}) => {

  const [login, setLogin] = useState('teste');
  const [password, setPassword] = useState('');
  const [msgErro, setMsgErro] = useState('');
  const [isLoading, setLoading] = useState(false);

  const doLogin = async(e : any) =>{
    try{
      setLoading(true);
      e.preventDefault();
     
      if(!login || !password){
        setMsgErro('Parâmetros de entrada inválidos');
        setLoading(false)
        return;
      }

      const body = {
        login,
        password
      }

    const result = await executeRequest('login', 'POST', body);

    setMsgErro('');
    if(result && result.data){
      localStorage.setItem('accessToken', result.data.token);
      localStorage.setItem('userName', result.data.name);
      localStorage.setItem('userEmail', result.data.email);
      setAccessToken(result.data.token);
    }else{
      setMsgErro('Não foi possível processar o login, tente novamente!');
    }
    
  }catch(e: any){
      console.log(e);
      if(e?.response?.data?.error){
        setMsgErro(e?.response?.data?.error);
      }else{
      setMsgErro('Usuário ou senha inválidos');
    }
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

export {Login}