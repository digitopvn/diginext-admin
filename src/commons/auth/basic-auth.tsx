import { Segmented } from "antd";
import React, { useState } from "react";

import LoginForm from "./login-form";
import RegisterForm from "./register-form";

const BasicAuth = () => {
	const [tab, setTab] = useState("Sign in");
	// console.log("tab :>> ", tab);
	return (
		<div>
			<Segmented options={["Sign in", "Register"]} onChange={(value) => setTab(value.toString())} />
			<div className="p-3">
				{tab === "Sign in" && <LoginForm />}
				{tab === "Register" && <RegisterForm />}
			</div>
		</div>
	);
};

export default BasicAuth;
