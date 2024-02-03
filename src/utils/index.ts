type AnyObject = {
  [key: string]: any;
};

export const omitEmptyField = <T extends AnyObject>(obj: T): Partial<T> => {
  const result: Partial<T> = {};

  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      const value = obj[key];
      if (value !== undefined && value !== 'null') {
        result[key] = value;
      }
    }
  }

  return result;
};
