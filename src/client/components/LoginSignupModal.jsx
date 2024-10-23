import React, { useState, useEffect, useCallback, useReducer, useContext } from 'react';
import Modal from 'react-modal';
import { FaEnvelope, FaUser } from 'react-icons/fa';
import { MdOutlineVpnKey } from 'react-icons/md';
import classNames from 'classnames';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../context/UserContext';

const initialState = {
  email: '',
  firstname: '',
  lastname: '',
  password: '',
};

function reducer(state, action) {
  switch (action.type) {
    case 'SET_EMAIL':
      return { ...state, email: action.payload };
    case 'SET_FIRSTNAME':
      return { ...state, firstname: action.payload };
    case 'SET_LASTNAME':
      return { ...state, lastname: action.payload };
    case 'SET_PASSWORD':
      return { ...state, password: action.payload };
    case 'RESET':
      return initialState;
    default:
      return state;
  }
}

const InputField = ({ label, type, icon: Icon, value, onChange, error }) => (
  <div className="mb-4">
    <label className="block text-gray-700">{label}</label>
    <div className="relative">
      <Icon className="absolute left-3 top-4 text-gray-400" />
      <input
        type={type}
        className={classNames(
          'w-full p-3 pl-10 border rounded-lg text-black',
          error ? 'border-red-500' : 'border-gray-300'
        )}
        value={value}
        onChange={onChange}
      />
      {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
    </div>
  </div>
);

const LoginSignupModal = ({ isOpen, onClose, initialAction }) => {
  const [action, setAction] = useState(initialAction || 'Sign In');
  const [state, dispatch] = useReducer(reducer, initialState);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [responseMessage, setResponseMessage] = useState(''); // New state to store backend responses
  const { setIsLoggedIn } = useContext(UserContext);
  const navigate = useNavigate();

  const sanitizeInput = (input) => input.trim();

  const validate = () => {
    const newErrors = {};
    if (!state.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(state.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    if (!state.password) {
      newErrors.password = 'Password is required';
    } else if (state.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    if (action === 'Sign Up') {
      if (!state.firstname) {
        newErrors.firstname = 'First name is required';
      }
      if (!state.lastname) {
        newErrors.lastname = 'Last name is required';
      }
    }
    return newErrors;
  };

  const handleSubmit = useCallback(
    async (event) => {
      event.preventDefault();
      setResponseMessage(''); // Clear any previous response messages
      const formErrors = validate();
      if (Object.keys(formErrors).length > 0) {
        setErrors(formErrors);
        return;
      }
      setErrors({});
      setLoading(true);

      const payload = {
        email: sanitizeInput(state.email),
        password: sanitizeInput(state.password),
      };

      if (action === 'Sign Up') {
        payload.firstName = sanitizeInput(state.firstname);
        payload.lastName = sanitizeInput(state.lastname);
      }

      const url =
        action === 'Sign In'
          ? `${process.env.REACT_APP_BACKEND_URL}/api/auth`
          : `${process.env.REACT_APP_BACKEND_URL}/api/users`;

      try {
        const response = await fetch(url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
          },
          body: JSON.stringify(payload),
        });

        const data = await response.json();
        if (!response.ok) {
          setResponseMessage(data.message || 'An error occurred');
        } else {
          setIsLoggedIn(true);
          localStorage.setItem('userId', data.userId);
          setResponseMessage('Success: ' + (data.message || 'Operation successful'));

          if (action === 'Sign In') {
            navigate('/services');
          }
          onClose();
        }
      } catch (error) {
        setResponseMessage('An error occurred while processing your request. Please try again later.');
      } finally {
        setLoading(false);
      }
    },
    [action, state, onClose, navigate, setIsLoggedIn]
  );

  const toggleAction = useCallback(() => {
    setAction((prevAction) => (prevAction === 'Sign In' ? 'Sign Up' : 'Sign In'));
    dispatch({ type: 'RESET' });
    setErrors({});
    setResponseMessage('');
  }, []);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      overlayClassName="fixed inset-0 bg-black bg-opacity-60 z-50 flex justify-center items-center p-4 sm:p-6 md:p-8"
      className={classNames(
        'relative bg-white py-8 px-6 sm:px-10 md:px-14 lg:px-20 w-[90%] rounded-lg shadow-lg m-auto',
        action === 'Sign In' ? 'sm:w-4/5 md:w-3/5 lg:w-2/5 2xl:w-1/3' : 'max-w-xl'
      )}
    >
      <h2 className="text-2xl font-bold text-black mb-4 text-center">{action}</h2>
      <p className="text-center text-gray-500 mb-8">Please enter your details</p>
      <form onSubmit={handleSubmit}>
        {action === 'Sign Up' && (
          <>
            <InputField
              label="First Name"
              type="text"
              icon={FaUser}
              value={state.firstname}
              onChange={(e) => dispatch({ type: 'SET_FIRSTNAME', payload: e.target.value })}
              error={errors.firstname}
            />
            <InputField
              label="Last Name"
              type="text"
              icon={FaUser}
              value={state.lastname}
              onChange={(e) => dispatch({ type: 'SET_LASTNAME', payload: e.target.value })}
              error={errors.lastname}
            />
          </>
        )}
        <InputField
          label="Email"
          type="email"
          icon={FaEnvelope}
          value={state.email}
          onChange={(e) => dispatch({ type: 'SET_EMAIL', payload: e.target.value })}
          error={errors.email}
        />
        <InputField
          label="Password"
          type="password"
          icon={MdOutlineVpnKey}
          value={state.password}
          onChange={(e) => dispatch({ type: 'SET_PASSWORD', payload: e.target.value })}
          error={errors.password}
        />

        {loading && (
          <div className="flex justify-center items-center my-4">
            <div className="w-6 h-6 border-t-4 border-red-600 border-solid rounded-full animate-spin"></div>
          </div>
        )}

        <button
          type="submit"
          className="bg-red-600 hover:bg-[#c32222] active:bg-red-700 text-white w-full py-2 rounded-lg font-semibold transition-all ease-in-out duration-200"
          disabled={loading}
        >
          {loading ? 'Processing...' : action}
        </button>
      </form>

      {/* Display backend response message */}
      {responseMessage && (
        <div className="text-center mt-4 text-sm text-red-600">{responseMessage}</div>
      )}

      <div className="mt-4 text-center">
        {action === 'Sign In' ? (
          <>
            <span>Don't have an account?</span>
            <button onClick={toggleAction} className="text-red-600 underline">
              Sign Up
            </button>
          </>
        ) : (
          <>
            <span>Already have an account?</span>
            <button onClick={toggleAction} className="text-red-600 underline">
              Sign In
            </button>
          </>
        )}
      </div>
    </Modal>
  );
};

export default LoginSignupModal;
