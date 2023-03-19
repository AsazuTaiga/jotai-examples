import { atom, useAtom } from 'jotai';
import React from 'react';

const firstNameAtom = atom('');
const lastNameAtom = atom('');

function App() {
  const [firstName, setFirstName] = useAtom(firstNameAtom);
  const [lastName, setLastName] = useAtom(lastNameAtom);

  function handleFirstNameChange(event: React.ChangeEvent<HTMLInputElement>) {
    setFirstName(event.target.value);
  }

  function handleLastNameChange(event: React.ChangeEvent<HTMLInputElement>) {
    setLastName(event.target.value);
  }

  return (
    <div>
      <div>
        <label htmlFor="firstName">First Name:</label>
        <input id="firstName" type="text" value={firstName} onChange={handleFirstNameChange} />
      </div>
      <div>
        <label htmlFor="lastName">Last Name:</label>
        <input id="lastName" type="text" value={lastName} onChange={handleLastNameChange} />
      </div>
    </div>
  );
}

export default App;