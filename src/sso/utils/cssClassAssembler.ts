const cssClassAssembler = (customClasses = '', defaultClasses: string = '') =>
  (customClasses ? `${customClasses} ${defaultClasses}` : defaultClasses).trim();

export default cssClassAssembler;
