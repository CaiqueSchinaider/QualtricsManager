import Text from "./Text";

interface ButtonProps {
  text: string;
  size: "small" | "medium" | "large";
  className?: string;
  onChildClick: () => void;
  activate?: boolean;
  contrastStyle?: boolean;
  block?: boolean;
}

export default function Button(props: ButtonProps) {
  return (
    <button
      onClick={props.block ? undefined : props.onChildClick}
      className={` ${props.block ? "opacity-80" : "hover:scale-98 cursor-pointer "} ${props.activate ? (props.contrastStyle ? "bg-schin-cyan border-none" : "bg-schin-gray-strong font-bold ") : props.contrastStyle ? "bg-schin-black border-schin-cyan" : "border-schin-gray-strong"}      ${props.className}  ${props.size === "small" ? "w-30 min-w-30  h-15" : props.size === "medium" ? "w-40 min-w-45  h-15" : "w-66 min-w-66  h-20"}  border rounded-2xl flex justify-center items-center  duration-105 transition-all `}
    >
      <Text
        size="small"
        className={
          props.activate
            ? props.contrastStyle
              ? "text-schin-black font-bold"
              : "text-schin-black"
            : props.contrastStyle
              ? "text-schin-cyan"
              : "text-schin-gray-light"
        }
      >
        {props.text}
      </Text>
    </button>
  );
}
