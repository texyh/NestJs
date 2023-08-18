import { Controller, Get } from "@nestjs/common";

@Controller("/app")
class AppController {
  @Get("/asdf")
  getRootRoute() {
    return "hi there";
  }
}

export default AppController;
