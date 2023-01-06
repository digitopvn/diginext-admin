import type { ReactNode } from "react";

/**
 * This Component will wrap all it's props.components and render them one by one ,
 * ! To avoid 'provider-hell' (y)
 * @param {Object} props - Compose's properties
 * @param {Array<Component>} props.components - list of the Providers to be provide
 */
export default function Compose(props: { components?: any[]; children?: ReactNode; key?: any } = {}) {
	const { components = [], children, ...rest } = props;

	return (
		// use reduceRight as reduce() but all the items will be reversed
		<>
			{components.reduceRight((acc: ReactNode, ProviderComponent: any) => {
				return (
					<ProviderComponent {...rest} key={props.key}>
						{acc}
					</ProviderComponent>
				);
			}, children)}
		</>
	);
}
