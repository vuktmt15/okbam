import * as React from "react";
import {SVGProps} from "react";

export default function IconBook(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={24}
      height={24}
      fill="none"
      {...props}
    >
      <path
        fill="currentColor"
        d="M22 4.85v11.89c0 .97-.79 1.86-1.76 1.98l-.31.04c-1.64.22-3.95.9-5.81 1.68-.65.27-1.37-.22-1.37-.93V5.6c0-.37.21-.71.54-.89 1.83-.99 4.6-1.87 6.48-2.03h.06c1.2 0 2.17.97 2.17 2.17ZM10.71 4.71c-1.83-.99-4.6-1.87-6.48-2.03h-.07c-1.2 0-2.17.97-2.17 2.17v11.89c0 .97.79 1.86 1.76 1.98l.31.04c1.64.22 3.95.9 5.81 1.68.65.27 1.37-.22 1.37-.93V5.6a1 1 0 0 0-.53-.89ZM5 7.74h2.25a.749.749 0 1 1 0 1.5H5a.749.749 0 1 1 0-1.5Zm3 4.5H5a.749.749 0 1 1 0-1.5h3a.749.749 0 1 1 0 1.5Z"
      />
    </svg>
  );
}
