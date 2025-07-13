export const formatName = (fullName: string) => {
    if (!fullName) return 'Name not available';
    const nameParts = fullName.split(' ');
    const firstName = nameParts[0];
    const lastInitial = nameParts[1]?.charAt(0) || '';
    return `${firstName} ${lastInitial}${lastInitial ? '.' : ''}`;
  };