import { Spinner } from "@material-tailwind/react";

function Loading() {
  return (
    <div className="flex items-center justify-center w-full h-[50vh]">
      <Spinner color="blue-gray" />
    </div>
  );
}

export default Loading;
