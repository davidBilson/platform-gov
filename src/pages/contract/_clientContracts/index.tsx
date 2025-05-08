import ActiveContracts from './_activeContracts';
import CompletedContracts from './_completedContracts';
import InactiveContracts from './_inactiveContracts';

const ClientContracts = () => {

  return (
    <>
      <ActiveContracts />
      <InactiveContracts />
      <CompletedContracts />
    </>
  );
};

export default ClientContracts;