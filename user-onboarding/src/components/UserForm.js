import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Form, Field, withFormik } from 'formik';
import * as Yup from 'yup';

const UserForm = ({ status, errors, touched, values }) => {
  const [users, setUsers] = useState([])

  useEffect(() => {
    if (status) {
      setUsers([...users, status]);
    }
  }, [status]);

  return (
    <div className="user-form">
      <h1>User Form</h1>

      <Form>

        <Field type="text" name="userName" placeholder="Name" />
        {touched.userName && errors.userName && (
          <p className="error">{errors.userName}</p>
        )}

        <Field type="email" name="email" placeholder="Email" />
        {touched.email && errors.email && <p>{errors.email}</p>}

        <Field type="password" name="password" placeholder="Password" />
        {touched.password && errors.password && <p>{errors.password}</p>}

        <label className="termsOfService">
          Terms of Service
          <Field
            type="checkbox"
            name="tos"
            checked={values.terms}
          />
          <span className="checkmark" />
        </label>

        <button type="submit">Submit!</button>
      </Form>

      {users.map(user => (
        <p key={user.userName}>{user.userName}, {user.email}</p>
      ))}
    </div>
  );
};

// Higher Order Component - HOC
// Hard to share component / stateful logic (custom hooks)
// Function that takes in a component, extends some logic onto that component,
// returns a _new_ component (copy of the passed in component with the extended logic)
const FormikUserForm = withFormik({
  mapPropsToValues({ userName, email, password, terms }) {
    return {
      terms: terms || false,
      userName: userName || '',
      email: email || '',
      password: password || '',
    }
  },

  validationSchema: Yup.object().shape({
    userName: Yup.string().required('You must enter your name'),
    email: Yup.string('Enter a valid email')
      .required('Email is required'),
    password: Yup.string()
      .min(8, 'Password must be 8 characters or longer')
      .required('Password is required'),
    terms: Yup.bool()
      .oneOf([true], 'You must accept the terms')

  }),

  handleSubmit(values, { setStatus }) {
    axios
      .post('https://reqres.in/api/users/', values)
      .then(res => {
        setStatus(res.data)
      })
      .catch(err => console.log(err.response));
  }
})(UserForm);

export default FormikUserForm;

