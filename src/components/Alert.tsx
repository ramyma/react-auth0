import ExclamationTriangleIcon from '@heroicons/react/24/outline/ExclamationTriangleIcon';
import type { PropsWithChildren } from 'react';
import { twMerge } from 'tailwind-merge';
import Button, { type ButtonProps } from '../components/Button';

type AlertProps = {
  /**
   * Alert type, mainly affects the component's colors
   */
  type: 'info' | 'error' | 'warning';
  /**
   * Array of actions to show, accepts Button props
   */
  actions?: AlertAction[];
} & PropsWithChildren;

type AlertAction = { label: string } & Omit<ButtonProps, 'children'>;

/**
 * Shows a message box with optional configurable actions
 */
const Alert = ({ children, actions, type = 'info' }: AlertProps) => {
  return (
    <div
      role="alert"
      className={`alert ${type === 'error' ? 'alert-error' : type === 'warning' ? 'alert-warning' : 'alert-info'} alert-soft text-white min-w-fit max-w-[25%] justify-self-center-safe`}
    >
      <ExclamationTriangleIcon width={20} />
      <p>{children}</p>

      {actions && actions.length > 0 && (
        <div className="flex gap-2">
          {actions.map(({ label, className, ...rest }, index) => (
            <Button
              // biome-ignore lint/suspicious/noArrayIndexKey: in this case adding to the label is an extra precaution as labels should be unique to start with
              key={label + index}
              className={twMerge(
                `btn-ghost hover:bg-neutral/5 ${type === 'error' ? 'text-error' : type === 'warning' ? 'text-warning' : 'text-info'} hover:text-inherit hover:border-none hover:outline-none border-none`,
                className
              )}
              {...rest}
            >
              Retry
            </Button>
          ))}
        </div>
      )}
    </div>
  );
};

export default Alert;
