import { Modal } from "antd";
import type { ModalStaticFunctions } from "antd/es/modal/confirm";
import type { ReactNode } from "react";
import { createContext, useContext } from "react";

type IModalContext = {
	modal?: Omit<ModalStaticFunctions, "warn">;
};

export const ModalContext = createContext<IModalContext>({});

export const ModalProvider = (props: { children?: ReactNode } = {}) => {
	const [modal, contextHolder] = Modal.useModal();

	return (
		<ModalContext.Provider value={{ modal }}>
			{props.children}
			{contextHolder}
		</ModalContext.Provider>
	);
};

export const useModalProvider = () => {
	const context = useContext(ModalContext);
	return context;
};

export default ModalProvider;
