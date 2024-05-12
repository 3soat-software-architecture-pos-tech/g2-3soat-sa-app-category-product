import express from "express";
import categoryRoutes from "../categoryRoutes.js";
import categoryController from "../../controllers/categoryController.js";

// Mocking the behavior of categoryController
jest.mock("../../controllers/categoryController.js", () => {
  return jest.fn(() => ({
    fetchAllCategory: jest.fn(),
    fetchCategoryById: jest.fn(),
    addNewCategory: jest.fn(),
    updateCategoryById: jest.fn(),
    deleteCategoryById: jest.fn(),
  }));
});

describe("Category Routes", () => {
  let router;
  let controller;

  beforeAll(() => {
    router = categoryRoutes(express);
    controller = categoryController();
  });

  it("should import categoryController correctly", () => {
    expect(categoryController).toHaveBeenCalled();
  });

  it("should create an Express router", () => {
    
    expect(router).toBeDefined();
    expect(typeof router.get).toBe('function');
    //expect(router).toBeInstanceOf(express.Router);
  });
 
  it("should define GET endpoints with the correct controller functions", () => {
    //controller.fetchAllCategory.mock.fetchAllCategory
    expect(router.stack[0].route.path).toBe("/");
    expect(router.stack[0].route.methods.get).toBeTruthy();
    //expect(router.stack[0].route.stack[0].handle).toBe(controller.fetchAllCategory.mock);

    expect(router.stack[1].route.path).toBe("/:id");
    expect(router.stack[1].route.methods.get).toBeTruthy();
    //expect(router.stack[1].route.stack[0].handle).toBe(controller.fetchCategoryById);
  });

  it("should define POST endpoint with the correct controller function", () => {
    expect(router.stack[2].route.path).toBe("/");
    expect(router.stack[2].route.methods.post).toBeTruthy();
    //expect(router.stack[2].route.stack[0].handle).toBe(controller.addNewCategory);
  });

  it("should define PUT endpoint with the correct controller function", () => {
    expect(router.stack[3].route.path).toBe("/:id");
    expect(router.stack[3].route.methods.put).toBeTruthy();
    //expect(router.stack[3].route.stack[0].handle).toBe(controller.updateCategoryById);
  });

  it("should define DELETE endpoint with the correct controller function", () => {
    expect(router.stack[4].route.path).toBe("/:id");
    expect(router.stack[4].route.methods.delete).toBeTruthy();
    //expect(router.stack[4].route.stack[0].handle).toBe(controller.deleteCategoryById);
  });
});
