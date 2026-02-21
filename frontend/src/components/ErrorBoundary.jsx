

// import React from 'react';

// class ErrorBoundary extends React.Component {
//   constructor(props) {
//     super(props);
//     this.state = { 
//       hasError: false,
//       error: null,
//       errorInfo: null
//     };
//   }

//   static getDerivedStateFromError(error) {
//     // Update state so the next render will show the fallback UI
//     return { hasError: true };
//   }

//   componentDidCatch(error, errorInfo) {
//     // You can log the error to an error reporting service
//     console.error('Error caught by boundary:', error, errorInfo);
//     this.setState({
//       error: error,
//       errorInfo: errorInfo
//     });
//   }

//   render() {
//     if (this.state.hasError) {
//       // Custom fallback UI
//       return (
//         <div className="error-boundary">
//           <div className="error-container">
//             <div className="error-icon">⚠️</div>
//             <h2>Something went wrong</h2>
//             <p>We're sorry, but there was an error loading this section.</p>
//             {this.props.fallback || (
//               <button 
//                 onClick={() => window.location.reload()} 
//                 className="error-reload-btn"
//               >
//                 Reload Page
//               </button>
//             )}
            
//             {/* Show error details in development */}
//             {process.env.NODE_ENV === 'development' && this.state.error && (
//               <details className="error-details">
//                 <summary>Error Details</summary>
//                 <pre>{this.state.error.toString()}</pre>
//                 <pre>{this.state.errorInfo?.componentStack}</pre>
//               </details>
//             )}
//           </div>
//         </div>
//       );
//     }

//     return this.props.children;
//   }
// }

// export default ErrorBoundary;



import React from 'react';
import './ErrorBoundary.css';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { 
      hasError: false,
      error: null,
      errorInfo: null
    };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // You can log the error to an error reporting service
    console.error('Error caught by boundary:', error, errorInfo);
    this.setState({
      error: error,
      errorInfo: errorInfo
    });
    
    // You could also send to an error tracking service like Sentry
    // if (window.Sentry) {
    //   window.Sentry.captureException(error, { extra: errorInfo });
    // }
  }

  handleReset = () => {
    this.setState({ 
      hasError: false, 
      error: null, 
      errorInfo: null 
    });
    
    // Optionally reset the component tree
    if (this.props.onReset) {
      this.props.onReset();
    }
  };

  handleReload = () => {
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      // Custom fallback UI based on error type or props
      const { fallback, fallbackType = 'default' } = this.props;
      
      if (fallback) {
        return fallback;
      }

      // Different fallback styles based on type
      const fallbackConfig = {
        default: {
          icon: '⚠️',
          title: 'Something went wrong',
          message: 'We\'re sorry, but there was an error loading this section.',
          buttonText: 'Reload Page'
        },
        auth: {
          icon: '🔒',
          title: 'Authentication Error',
          message: 'There was a problem with your authentication. Please try logging in again.',
          buttonText: 'Go to Login'
        },
        network: {
          icon: '🌐',
          title: 'Network Error',
          message: 'Unable to connect to the server. Please check your internet connection.',
          buttonText: 'Try Again'
        },
        notFound: {
          icon: '🔍',
          title: 'Not Found',
          message: 'The content you\'re looking for could not be found.',
          buttonText: 'Go Home'
        }
      };

      const config = fallbackConfig[fallbackType] || fallbackConfig.default;

      return (
        <div className="error-boundary">
          <div className="error-container">
            <div className="error-icon">{config.icon}</div>
            <h2>{config.title}</h2>
            <p>{config.message}</p>
            
            <div className="error-actions">
              {fallbackType === 'auth' ? (
                <button 
                  onClick={() => window.location.href = '/login'} 
                  className="error-btn primary"
                >
                  {config.buttonText}
                </button>
              ) : fallbackType === 'notFound' ? (
                <button 
                  onClick={() => window.location.href = '/'} 
                  className="error-btn primary"
                >
                  {config.buttonText}
                </button>
              ) : (
                <button 
                  onClick={this.handleReload} 
                  className="error-btn primary"
                >
                  {config.buttonText}
                </button>
              )}
              
              <button 
                onClick={this.handleReset} 
                className="error-btn secondary"
              >
                Dismiss
              </button>
            </div>
            
            {/* Show error details in development */}
            {process.env.NODE_ENV === 'development' && this.state.error && (
              <details className="error-details">
                <summary>Error Details (Development Only)</summary>
                <div className="error-stack">
                  <strong>Error:</strong>
                  <pre>{this.state.error.toString()}</pre>
                </div>
                {this.state.errorInfo && (
                  <div className="error-stack">
                    <strong>Component Stack:</strong>
                    <pre>{this.state.errorInfo.componentStack}</pre>
                  </div>
                )}
              </details>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;