const authService = require('../services/auth.service');
const { sendSuccess } = require('../helpers/response.helper');

class AuthController {
  async register(req, res) {
    const result = await authService.register(req.body);
    sendSuccess(res, 'User registered successfully', result, {}, 201);
  }

  async login(req, res) {
    const result = await authService.login(req.body.email, req.body.password);
    sendSuccess(res, 'Login successful', result);
  }
}
module.exports = new AuthController();
