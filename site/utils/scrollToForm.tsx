export const scrollToForm = (id?:string): void => {
    const formElement = document.getElementById(id ? id:"form");
    if (formElement) {
      formElement.scrollIntoView({ behavior: 'smooth' });
    }
};