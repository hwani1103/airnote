import React from "react";

type Props = {
  handleFlag: () => void;
};
//이거는 냅뒀다가 Note Fetch한후 Read할때 적용하자. Create는 페이지를 만드는게 나을듯
export default function NoteCreateModal({ handleFlag }: Props) {
  return (
    <div>
      <div className="fixed top-0 left-0 opacity-50 w-full h-full bg-black "></div>
      <div className="fixed top-10 right-0 left-0 bg-white w-[90%] h-[90%] mx-auto">
        <div className="flex justify-end">
          <button
            onClick={handleFlag}
            className="p-2 m-4 bg-rose-600 text-white rounded-lg shadow-md"
          >
            닫기
          </button>
        </div>
      </div>
    </div>
  );
}
