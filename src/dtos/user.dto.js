class UserDTOResponse {
  constructor(user) {
    this._id = user?._id || "";
    this.name = user?.name || "";
    this.email = user?.email || "";
    this.role = user?.role || "";
    this.avatar = user?.avatar?.url || "";

    return Object.freeze(this);
  }
}
export { UserDTOResponse };
