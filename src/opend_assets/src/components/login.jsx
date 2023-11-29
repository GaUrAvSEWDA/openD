import React from 'react';
import { Link } from 'react-router-dom';

function Login() {
  return (
    <div className="container-fluid p-3 my-5">
      <div className="row">
        <div className="col-10 col-md-6">
          <img src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-login-form/draw2.svg"
            className="img-fluid" alt="Phone image" />
        </div>

        <div className="col-4 col-md-6">
          <form>
            <div className="mb-4">
              <label htmlFor="email" className="form-label">Email address</label>
              <input type="email" className="form-control" id="email" aria-describedby="emailHelp" />
            </div>

            <div className="mb-4">
              <label htmlFor="password" className="form-label">Password</label>
              <input type="password" className="form-control" id="password" />
            </div>

            <div className="d-flex justify-content-between mx-4 mb-4">
              <div className="form-check">
                <input type="checkbox" className="form-check-input" id="rememberMe" />
                <label className="form-check-label" htmlFor="rememberMe">Remember me</label>
              </div>
              <a href="#">Forgot password?</a>
            </div>

            <button type="submit" className="btn btn-primary w-100">Sign in</button>

            <div className="divider d-flex align-items-center my-4">
              <p className="text-center fw-bold mx-3 mb-0">OR</p>
            </div>

            <Link to="/register" className="btn btn-primary w-100" style={{ backgroundColor: '#3b5998' }}>
              Register
            </Link>

            {/* Other social login buttons */}
          </form>
        </div>
      </div>
    </div>
  );
}

export default Login;
