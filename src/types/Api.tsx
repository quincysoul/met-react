/* eslint-disable */
/* tslint:disable */
/*
 * ---------------------------------------------------------------
 * ## THIS FILE WAS GENERATED VIA SWAGGER-TYPESCRIPT-API        ##
 * ##                                                           ##
 * ## AUTHOR: acacode                                           ##
 * ## SOURCE: https://github.com/acacode/swagger-typescript-api ##
 * ---------------------------------------------------------------
 */

export interface Agency {
  /** @format int32 */
  agency_id?: number;
  agency_name?: string | null;
}

export interface AlertMessage {
  stop_closed?: boolean;
  alert_text?: string | null;
}

export interface Departure {
  actual?: boolean;
  trip_id?: string | null;

  /** @format int32 */
  stop_id?: number;
  departure_text?: string | null;

  /** @format int64 */
  departure_time?: number;
  description?: string | null;
  gate?: string | null;
  route_id?: string | null;
  route_short_name?: string | null;

  /** @format int32 */
  direction_id?: number;
  direction_text?: string | null;
  terminal?: string | null;
  schedule_relationship?: string | null;
}

export interface Direction {
  /** @format int32 */
  direction_id?: number;
  direction_name?: string | null;
}

export interface NexTripResult {
  stops?: Stop[] | null;
  alerts?: AlertMessage[] | null;
  departures?: Departure[] | null;
}

export interface Place {
  place_code?: string | null;
  description?: string | null;
}

export interface ProblemDetails {
  type?: string | null;
  title?: string | null;

  /** @format int32 */
  status?: number | null;
  detail?: string | null;
  instance?: string | null;
}

export interface Route {
  route_id?: string | null;

  /** @format int32 */
  agency_id?: number;
  route_label?: string | null;
}

export interface Stop {
  /** @format int32 */
  stop_id?: number;

  /** @format double */
  latitude?: number;

  /** @format double */
  longitude?: number;
  description?: string | null;
}

export interface Vehicle {
  trip_id?: string | null;

  /** @format int32 */
  direction_id?: number;
  direction?: string | null;

  /** @format int64 */
  location_time?: number;
  route_id?: string | null;
  terminal?: string | null;

  /** @format float */
  latitude?: number;

  /** @format float */
  longitude?: number;

  /** @format float */
  bearing?: number;

  /** @format double */
  odometer?: number;

  /** @format float */
  speed?: number;
}

export type QueryParamsType = Record<string | number, any>;
export type ResponseFormat = keyof Omit<Body, "body" | "bodyUsed">;

export interface FullRequestParams extends Omit<RequestInit, "body"> {
  /** set parameter to `true` for call `securityWorker` for this request */
  secure?: boolean;
  /** request path */
  path: string;
  /** content type of request body */
  type?: ContentType;
  /** query params */
  query?: QueryParamsType;
  /** format of response (i.e. response.json() -> format: "json") */
  format?: ResponseFormat;
  /** request body */
  body?: unknown;
  /** base url */
  baseUrl?: string;
  /** request cancellation token */
  cancelToken?: CancelToken;
}

export type RequestParams = Omit<FullRequestParams, "body" | "method" | "query" | "path">;

export interface ApiConfig<SecurityDataType = unknown> {
  baseUrl?: string;
  baseApiParams?: Omit<RequestParams, "baseUrl" | "cancelToken" | "signal">;
  securityWorker?: (securityData: SecurityDataType | null) => Promise<RequestParams | void> | RequestParams | void;
  customFetch?: typeof fetch;
}

export interface HttpResponse<D extends unknown, E extends unknown = unknown> extends Response {
  data: D;
  error: E;
}

type CancelToken = Symbol | string | number;

export enum ContentType {
  Json = "application/json",
  FormData = "multipart/form-data",
  UrlEncoded = "application/x-www-form-urlencoded",
}

export class HttpClient<SecurityDataType = unknown> {
  public baseUrl: string = "";
  private securityData: SecurityDataType | null = null;
  private securityWorker?: ApiConfig<SecurityDataType>["securityWorker"];
  private abortControllers = new Map<CancelToken, AbortController>();
  private customFetch = (...fetchParams: Parameters<typeof fetch>) => fetch(...fetchParams);

  private baseApiParams: RequestParams = {
    credentials: "same-origin",
    headers: {},
    redirect: "follow",
    referrerPolicy: "no-referrer",
  };

  constructor(apiConfig: ApiConfig<SecurityDataType> = {}) {
    Object.assign(this, apiConfig);
  }

  public setSecurityData = (data: SecurityDataType | null) => {
    this.securityData = data;
  };

  private encodeQueryParam(key: string, value: any) {
    const encodedKey = encodeURIComponent(key);
    return `${encodedKey}=${encodeURIComponent(typeof value === "number" ? value : `${value}`)}`;
  }

  private addQueryParam(query: QueryParamsType, key: string) {
    return this.encodeQueryParam(key, query[key]);
  }

  private addArrayQueryParam(query: QueryParamsType, key: string) {
    const value = query[key];
    return value.map((v: any) => this.encodeQueryParam(key, v)).join("&");
  }

  protected toQueryString(rawQuery?: QueryParamsType): string {
    const query = rawQuery || {};
    const keys = Object.keys(query).filter((key) => "undefined" !== typeof query[key]);
    return keys
      .map((key) => (Array.isArray(query[key]) ? this.addArrayQueryParam(query, key) : this.addQueryParam(query, key)))
      .join("&");
  }

  protected addQueryParams(rawQuery?: QueryParamsType): string {
    const queryString = this.toQueryString(rawQuery);
    return queryString ? `?${queryString}` : "";
  }

  private contentFormatters: Record<ContentType, (input: any) => any> = {
    [ContentType.Json]: (input: any) =>
      input !== null && (typeof input === "object" || typeof input === "string") ? JSON.stringify(input) : input,
    [ContentType.FormData]: (input: any) =>
      Object.keys(input || {}).reduce((formData, key) => {
        const property = input[key];
        formData.append(
          key,
          property instanceof Blob
            ? property
            : typeof property === "object" && property !== null
              ? JSON.stringify(property)
              : `${property}`,
        );
        return formData;
      }, new FormData()),
    [ContentType.UrlEncoded]: (input: any) => this.toQueryString(input),
  };

  private mergeRequestParams(params1: RequestParams, params2?: RequestParams): RequestParams {
    return {
      ...this.baseApiParams,
      ...params1,
      ...(params2 || {}),
      headers: {
        ...(this.baseApiParams.headers || {}),
        ...(params1.headers || {}),
        ...((params2 && params2.headers) || {}),
      },
    };
  }

  private createAbortSignal = (cancelToken: CancelToken): AbortSignal | undefined => {
    if (this.abortControllers.has(cancelToken)) {
      const abortController = this.abortControllers.get(cancelToken);
      if (abortController) {
        return abortController.signal;
      }
      return void 0;
    }

    const abortController = new AbortController();
    this.abortControllers.set(cancelToken, abortController);
    return abortController.signal;
  };

  public abortRequest = (cancelToken: CancelToken) => {
    const abortController = this.abortControllers.get(cancelToken);

    if (abortController) {
      abortController.abort();
      this.abortControllers.delete(cancelToken);
    }
  };

  public request = async <T = any, E = any>({
    body,
    secure,
    path,
    type,
    query,
    format,
    baseUrl,
    cancelToken,
    ...params
  }: FullRequestParams): Promise<HttpResponse<T, E>> => {
    const secureParams =
      ((typeof secure === "boolean" ? secure : this.baseApiParams.secure) &&
        this.securityWorker &&
        (await this.securityWorker(this.securityData))) ||
      {};
    const requestParams = this.mergeRequestParams(params, secureParams);
    const queryString = query && this.toQueryString(query);
    const payloadFormatter = this.contentFormatters[type || ContentType.Json];
    const responseFormat = format || requestParams.format;

    return this.customFetch(`${baseUrl || this.baseUrl || ""}${path}${queryString ? `?${queryString}` : ""}`, {
      ...requestParams,
      headers: {
        ...(type && type !== ContentType.FormData ? { "Content-Type": type } : {}),
        ...(requestParams.headers || {}),
      },
      signal: cancelToken ? this.createAbortSignal(cancelToken) : void 0,
      body: typeof body === "undefined" || body === null ? null : payloadFormatter(body),
    }).then(async (response) => {
      const r = response as HttpResponse<T, E>;
      r.data = null as unknown as T;
      r.error = null as unknown as E;

      const data = !responseFormat
        ? r
        : await response[responseFormat]()
          .then((data) => {
            if (r.ok) {
              r.data = data;
            } else {
              r.error = data;
            }
            return r;
          })
          .catch((e) => {
            r.error = e;
            return r;
          });

      if (cancelToken) {
        this.abortControllers.delete(cancelToken);
      }

      if (!response.ok) throw data;
      return data;
    });
  };
}

/**
 * @title NexTrip API
 * @version 2
 *
 * API for creating Metro Transit real-time departure information display (beta, subject to change)
 */
export class Api<SecurityDataType extends unknown> extends HttpClient<SecurityDataType> {
  nextripv2 = {
    /**
     * No description
     *
     * @tags NexTrip
     * @name AgenciesList
     * @request GET:/nextripv2/agencies
     */
    agenciesList: (params: RequestParams = {}) =>
      this.request<Agency[], ProblemDetails | void>({
        path: `/nextripv2/agencies`,
        method: "GET",
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags NexTrip
     * @name RoutesList
     * @request GET:/nextripv2/routes
     */
    routesList: (params: RequestParams = {}) =>
      this.request<Route[], ProblemDetails | void>({
        path: `/nextripv2/routes`,
        method: "GET",
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags NexTrip
     * @name DirectionsDetail
     * @request GET:/nextripv2/directions/{route_id}
     */
    directionsDetail: (routeId: string, params: RequestParams = {}) =>
      this.request<Direction[], ProblemDetails | void>({
        path: `/nextripv2/directions/${routeId}`,
        method: "GET",
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags NexTrip
     * @name StopsDetail
     * @request GET:/nextripv2/stops/{route_id}/{direction_id}
     */
    stopsDetail: (routeId: string, directionId: number, params: RequestParams = {}) =>
      this.request<Place[], ProblemDetails | void>({
        path: `/nextripv2/stops/${routeId}/${directionId}`,
        method: "GET",
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags NexTrip
     * @name Nextripv2Detail
     * @request GET:/nextripv2/{stop_id}
     */
    nextripv2Detail: (stopId: number, params: RequestParams = {}) =>
      this.request<NexTripResult, ProblemDetails | void>({
        path: `/nextripv2/${stopId}`,
        method: "GET",
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags NexTrip
     * @name Nextripv2Detail2
     * @request GET:/nextripv2/{route_id}/{direction_id}/{place_code}
     * @originalName nextripv2Detail
     * @duplicate
     */
    nextripv2Detail2: (routeId: string, directionId: number, placeCode: string, params: RequestParams = {}) =>
      this.request<NexTripResult, ProblemDetails | void>({
        path: `/nextripv2/${routeId}/${directionId}/${placeCode}`,
        method: "GET",
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags NexTrip
     * @name VehiclesDetail
     * @request GET:/nextripv2/vehicles/{route_id}
     */
    vehiclesDetail: (routeId: string, params: RequestParams = {}) =>
      this.request<Vehicle[], ProblemDetails | void>({
        path: `/nextripv2/vehicles/${routeId}`,
        method: "GET",
        format: "json",
        ...params,
      }),
  };
}
