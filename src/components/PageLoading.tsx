import Loading from "./Loading";

const PageLoading = () => {
  return (
    <div class={"grid grid-justify-items-center grid-content-center h-full"}>
      <Loading size={48} />
      <div class={"text-center p-4"}>Loading</div>
    </div>
  );
};

export default PageLoading;
