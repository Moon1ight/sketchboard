import { href, Link } from 'react-router-dom';
import { Button } from '../../shared/components/Button/Button';
import { ROUTES } from '@/shared/model/routes';

export const LoginPage = () => {
    return <div>Login Page</div>
}

export const RegisterPage = () => {
    return <div>Register Page</div>
}

const AuthPage = () => {
    return (
        <div className='lg:flex w-[100%] h-[100%]'>
            <div className='lg:w-[80%] bg-[#a19aff] flex flex-col justify-center gap-4 p-4'>
                <h1 className='text-[#efefr4] text-[54px]'>Just Editor</h1>
                <p className='text-[20px]'>-Это графический редактор для небольших повседневных задач</p>
                <img src="editor-preview2.jpg" alt="preview"  className='lg:w-[75%] rounded-lg'/>
                <p>Тут наверное слайдер сделать надо бы</p>
            </div>
            <div className='lg:w-[20%] flex flex-col justify-center p-4'>
                <input className='border-1 mb-4 p-3 rounded-sm' type="text" placeholder='Name' />
                <input className='border-1 mb-4 p-3 rounded-sm' type="text" placeholder='Password' />
                <Button className='bg-[#a19aff] p-3 rounded-sm'>Войти</Button>
                <Link to={href(ROUTES.BOARDS)}>Board-list</Link>
            </div>
        </div>
    );
}

export default AuthPage;
