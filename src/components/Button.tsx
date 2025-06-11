import { twMerge } from 'tailwind-merge';

export type ButtonProps = React.ComponentProps<'button'>;

const Button = ({ children, type = 'button', className, ...rest }: ButtonProps) => {
  return (
    <button type={type} className={twMerge('btn', className)} {...rest}>
      {children}
    </button>
  );
};

export default Button;
