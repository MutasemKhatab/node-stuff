import { NextFunction, Request, Response } from "express";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { verifyToken } from "../../../src/services/middleware/auth.middleware";
import { ApiError } from "../../../src/utils/api-error";
import * as tokenUtils from "../../../src/utils/token";

describe("verifyToken middleware", () => {
  let req: Partial<Request>;
  let res: Partial<Response>;
  let next: NextFunction;

  beforeEach(() => {
    req = { headers: {} };
    res = {};
    next = vi.fn();
    vi.restoreAllMocks();
  });

  it("should throw ApiError if authorization header is missing", () => {
    expect(() =>
      verifyToken(req as Request, res as Response, next)
    ).toThrowError(ApiError);
    try {
      verifyToken(req as Request, res as Response, next);
    } catch (err: any) {
      expect(err).toBeInstanceOf(ApiError);
      expect(err.message).toBe("Authorization token is missing");
      expect(err.statusCode).toBe(401);
    }
  });

  it("should throw ApiError if token is missing after Bearer", () => {
    req.headers = { authorization: "Bearer" };
    expect(() =>
      verifyToken(req as Request, res as Response, next)
    ).toThrowError(ApiError);
    try {
      verifyToken(req as Request, res as Response, next);
    } catch (err: any) {
      expect(err).toBeInstanceOf(ApiError);
      expect(err.message).toBe("Authorization token is missing");
      expect(err.statusCode).toBe(401);
    }
  });

  it("should call decodeToken and call next if token is valid", () => {
    req.headers = { authorization: "Bearer validtoken" };
    const decodeTokenSpy = vi
      .spyOn(tokenUtils, "decodeToken")
      .mockImplementation(() => ({}));
    verifyToken(req as Request, res as Response, next);
    expect(decodeTokenSpy).toHaveBeenCalledWith("validtoken");
    expect(next).toHaveBeenCalled();
  });

  it("should throw ApiError if decodeToken throws", () => {
    req.headers = { authorization: "Bearer invalidtoken" };
    vi.spyOn(tokenUtils, "decodeToken").mockImplementation(() => {
      throw new Error("Invalid token");
    });
    expect(() =>
      verifyToken(req as Request, res as Response, next)
    ).toThrowError(ApiError);
    try {
      verifyToken(req as Request, res as Response, next);
    } catch (err: any) {
      expect(err).toBeInstanceOf(ApiError);
      expect(err.message).toBe("Invalid or expired token");
      expect(err.statusCode).toBe(401);
    }
  });
});
