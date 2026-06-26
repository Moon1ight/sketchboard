import { EditIcon, PlusIcon, Trash2Icon } from 'lucide-react';
import { Button } from '../../shared/components/Button/Button';
import { href, Link } from 'react-router-dom';
import { ROUTES } from '@/shared/model/routes';
import { CONFIG } from '@/shared/model/config';

const BoardsPage = () => {
    return (
        <div>
            <div className='bg-[#a19aff] py-5'>
                <div className='w-[80%] m-auto'>
                    <h2 className='text-[32px] mb-2 text-[#fff] font-bold'>Ваши доски {CONFIG.API_BASE_URL}</h2>
                    <p>На этой странице вы можете просмотреть свои доски или создать новую </p>
                </div>
            </div>
           <div className='w-[80%] m-auto'>
                <div className='flex justify-end py-5'>
                    <Button className='border-1 rounded-lg p-3 bg-[#a19aff] flex gap-3'><PlusIcon /> Создать доску</Button>
                </div>

                {/* Компонент доски */}
                <div className='lg:flex justify-between gap-10'>
                    <div className='flex rounded-lg p-4 gap-4 cursor-pointer lg:w-[50%]' style={{boxShadow: '3px 3px 10px #a19aff'}}>
                        <img src='editor-preview.jpg' alt='preview' className='h-40 border-1 border-[#d8d8d8] rounded-lg'/>
                        <div>
                            <h3 className='text-[24px]'>Board #1</h3>
                            <Link to={href(ROUTES.BOARD, { boardId: "1" })}>Ссылка</Link>
                            <p>Тестовая доска для просмотра возможностей приложения</p>
                            <span className='text-[gray]'>02.05.2026</span>
                        </div>
                        <div className='ml-auto flex flex-col gap-5'>
                            <EditIcon />
                            <Trash2Icon style={{color: 'red'}} />
                        </div>
                    </div>
                    <div className='flex rounded-lg p-4 gap-4 cursor-pointer lg:w-[50%]' style={{boxShadow: '3px 3px 10px #a19aff'}}>
                        <img src='editor-preview2.jpg' alt='preview' className='h-40 border-1 border-[#d8d8d8] rounded-lg'/>
                        <div>
                            <h3 className='text-[24px]'>Board #2</h3>
                            <p>Набросок епты бля</p>
                            <span className='text-[gray]'>11.05.2026</span>
                        </div>
                        <div className='ml-auto flex flex-col gap-5'>
                            <EditIcon />
                            <Trash2Icon style={{color: 'red'}} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

// export default BoardsPage;
export const Component = BoardsPage
