import { useTheme } from 'next-themes';
import { Toaster as Sonner } from 'sonner';

type ToasterProps = React.ComponentProps<typeof Sonner>;

const Toaster = ({ ...props }: ToasterProps) => {
	const { theme = 'system' } = useTheme();

	return (
		<Sonner
			theme={theme as ToasterProps['theme']}
			position="bottom-center"
			closeButton
			expand
			duration={5000}
			className="toaster group"
			toastOptions={{
				classNames: {
					toast: 'group border shadow-lg',
					title: 'font-semibold',
				},
			}}
			{...props}
		/>
	);
};

export { Toaster };
