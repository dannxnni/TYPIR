import LinkButton from '@/atoms/LinkButton/LinkButton';
import UnderBar from '@/atoms/UnderBar/UnderBar';

import MyImageTemplateNew from '@/molecules/MyImageTemplate/MyImageTemplateNew';
import MyDetailImage from '@/molecules/MyDetailImage/MyDetailImage';
import BoardTemplate from '@/molecules/BoardTemplate/BoardTemplate';
import { useLocation, useMatch, useNavigate, useParams, Link } from 'react-router-dom';
import { useAlbumStore, useBoardStore, useFilteredImagesStore } from '@/zustand/useStore';
import { useEffect } from 'react';
import NewBoard from '../NewBoard/NewBoard';

function SelectPostImage() {
  const { albums } = useAlbumStore();
  const { boards } = useBoardStore();
  const { filteredImages, setFilteredImages } = useFilteredImagesStore();
  const navigate = useNavigate();
  const location = useLocation();
  const pathname = location.pathname;

  /* 앨범 */
  // const newPostImageMatch = useMatch('/mypage/newpost/detail/:imageId');
  const newPostImageMatch = useMatch('/mypage/newpost/newBoard');
  const layoutId = newPostImageMatch?.params.imageId;
  const isAlbumDetail = newPostImageMatch != null;

  console.log('newPostImageMatch:', newPostImageMatch);

  /* 보드 */
  const boardImageMatch = useMatch('/mypage/newpost/board/:boardText');
  const boardDetailMatch = useMatch('/mypage/newpost/board/:boardText/detail/:imageId');
  const boardlayoutId = boardDetailMatch?.params.imageId;
  const isBoardDetail = boardDetailMatch != null;
  const { boardText } = useParams();

  const onBoardClicked = (boardText) => {
    navigate(`/mypage/newpost/board/${boardText}`);
  };

  const handleNavigate = (path) => {
    navigate(path);
  };

  // 보드 카테고리 필터링
  useEffect(() => {
    if (boardText) {
      const newFilteredImages = boards.flatMap((board) => board.images.filter((image) => image.category === boardText));
      setFilteredImages(newFilteredImages);
    }
  }, [boardText, boards, setFilteredImages]);

  return (
    <div className="w-full h-auto min-h-[570px] bg-white mt-2 mb-8">
      {/* 카테고리 바 */}
      <div className="flex justify-evenly pt-2">
        <LinkButton
          text="앨범"
          fontWeight="font-bold"
          fontColor="text-content"
          fontSize="text-[20px]"
          hoverColor="hover:text-black"
          onClick={() => handleNavigate('/mypage/newpost')}
        >
          {(pathname === '/mypage/newpost' || newPostImageMatch) && <UnderBar layoutId="post-underBar" margin="mt-1" />}
        </LinkButton>

        <LinkButton
          text="보드"
          fontWeight="font-bold"
          fontColor="text-content"
          fontSize="text-[20px]"
          hoverColor="hover:text-black"
          onClick={() => handleNavigate('/mypage/newpost/board')}
        >
          {(pathname === '/mypage/newpost/board' || boardImageMatch || boardDetailMatch) && (
            <UnderBar layoutId="post-underBar" margin="mt-1" />
          )}
        </LinkButton>
      </div>

      {/* 앨범 */}
      {(pathname === '/mypage/newpost' || isAlbumDetail) && (
        <div className="flex flex-col items-center mt-8 h-auto">
          {albums.map((album) => (
            <MyImageTemplateNew key={album.id} images={album.images} />
          ))}

          {newPostImageMatch && <NewBoard layoutId={layoutId} />}
        </div>
      )}

      {/* 보드 */}
      {pathname === '/mypage/newpost/board' && !boardImageMatch && !boardDetailMatch && (
        <div className="flex justify-center min-h-[600px]">
          <div
            className="grid sm:grid-cols-2 grid-cols-1 gap-[15px] justify-center my-6"
            style={{ gridAutoRows: 'min-content' }}
          >
            {boards.map((board) => (
              <BoardTemplate
                key={board.id}
                text={board.name}
                images={board.images}
                onBoardClick={() => onBoardClicked(board.name.toLowerCase())}
              />
            ))}
          </div>
        </div>
      )}

      {(boardImageMatch || isBoardDetail) && (
        <div className="flex flex-col items-center mt-8 h-auto">
          <MyImageTemplateNew images={filteredImages} />
        </div>
      )}

      {boardDetailMatch && <MyDetailImage layoutId={boardlayoutId} />}
    </div>
  );
}
export default SelectPostImage;
