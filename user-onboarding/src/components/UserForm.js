import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Form, Field, withFormik } from 'formik';
import * as Yup from 'yup';

const UserForm = ({ status, errors, touched, values, isSubmitting }) => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    if (status) {
      setUsers(users => [...users, status])
    }
  }, [status]);

  return (
    <div className="user-form">
      <h1>User Form</h1>

      <Form>
        <div>
          <Field type="text" name="userName" placeholder="Name" />
          {touched.userName && errors.userName && <p>{errors.userName}</p>}
        </div>
        <div>
          {touched.email && errors.email && <p>{errors.email}</p>}
          <Field type="email" name="email" placeholder="Email" />
        </div>
        <div>
          {touched.password && errors.password && <p>{errors.password}</p>}
          <Field type="password" name="password" placeholder="Password" />
        </div>

        <div>

        <label>{touched.terms && errors.terms && <p>{errors.terms}</p>}
          Terms of Service
          <Field
            type="checkbox"
            name="terms"
            checked={values.terms}
          />
          <span className="checkmark" />
        </label>
        </div>
        <button disabled={isSubmitting}>Submit!</button>
      </Form>

      {users.map(users => (
        <p key={users.id}>{users.userName}</p>
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
    userName: Yup.string()
      .min(4, 'Your name must be 4 characters or longer')
      .required('You must enter your name'),
    email: Yup.string()
      .email('Enter a valid email')
      .required('Email is required'),
    password: Yup.string()
      .min(8, 'Password must be 8 characters or longer')
      .required('Password is required'),
    terms: Yup.bool()
      .oneOf([true], 'You must accept the terms')
      .required('You have to agree with our terms')
  }),

  handleSubmit(values, { setStatus, resetForm, setSubmitting }) {
    axios
      .post("https://reqres.in/api/users/", values)
      .then(res => {
        console.log(res.data);
        setStatus(res.data);
        resetForm();
        setSubmitting(false);
      })
      .catch(err =>  {
        console.log(err);
        setSubmitting(false);
      });
  }

})(UserForm);

export default FormikUserForm;

