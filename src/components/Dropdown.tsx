import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  //   useRef,
  useState,
} from "react";
import {
  useFloating,
  autoUpdate,
  offset,
  flip,
  shift,
} from "@floating-ui/react-dom";

const Dropdown = (props: any, forwardedRef: any) => {
  const [visibility, setVisibility] = useState<any>(false);

  const { refs, floatingStyles } = useFloating({
    open: visibility,
    placement: props.placement || "bottom-end",
    middleware: [offset(props.offset || [0]), flip(), shift()],
    whileElementsMounted: autoUpdate,
  });

  const handleDocumentClick = (event: any) => {
    const referenceEl = refs.reference.current;
    const floatingEl = refs.floating.current;
    if (
      (referenceEl instanceof HTMLElement &&
        referenceEl.contains(event.target)) ||
      (floatingEl instanceof HTMLElement && floatingEl.contains(event.target))
    ) {
      return;
    }
    setVisibility(false);
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleDocumentClick);
    return () => {
      document.removeEventListener("mousedown", handleDocumentClick);
    };
  }, []);

  useImperativeHandle(forwardedRef, () => ({
    close() {
      setVisibility(false);
    },
  }));

  return (
    <>
      <button
        ref={refs.setReference}
        type="button"
        className={props.btnClassName}
        onClick={() => setVisibility(!visibility)}
      >
        {props.button}
      </button>
      <div
        ref={refs.setFloating}
        style={floatingStyles}
        className="z-50"
        onClick={() => setVisibility(!visibility)}
      >
        {visibility && props.children}
      </div>
    </>
  );
};

export default forwardRef(Dropdown);
