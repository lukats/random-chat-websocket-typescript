export const airbrakeParams = (): { projectId: number; projectKey: string } => {
  const id = parseInt(
    `${decodeURIComponent(
      escape(window.atob(`${process.env.REACT_APP_PROJECT_ID}`))
    )}`
  );
  const key = `${decodeURIComponent(
    escape(window.atob(`${process.env.REACT_APP_PROJECT_KEY}`))
  )}`;
  return {
    projectId: id,
    projectKey: key
  };
};
