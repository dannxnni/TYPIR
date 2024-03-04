const HeartCount = ({ count }) => {
  return (
    <p className="text-sm">
      좋아요 
      <span className="font-semibold ml-1">{count}</span>
      개
    </p>
  );
};

export default HeartCount;