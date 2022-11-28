export const amIChild = () => {
    return (process.hasOwnProperty("send") && typeof process.send === "function");
}