import React from 'react';
import { Notifier } from '@airbrake/browser';
import { airbrakeParams } from './utils';

export class ErrorBoundary extends React.Component<
  Record<string, unknown>,
  { hasError: boolean }
> {
  airbrake: Notifier;

  constructor(props: Record<string, unknown>) {
    super(props);
    this.state = {
      hasError: false
    };
    this.airbrake = new Notifier({
      ...airbrakeParams()
    });
  }

  static getDerivedStateFromError(): { hasError: boolean } {
    return { hasError: true };
  }

  componentDidCatch(error: unknown, errorInfo: unknown): void {
    this.airbrake.notify({ error, params: { info: errorInfo } });
  }

  render(): JSX.Element | null | undefined {
    if (this.state.hasError) {
      return <div>ha</div>;
    }

    return <React.Fragment>{this.props.children}</React.Fragment>;
  }
}
