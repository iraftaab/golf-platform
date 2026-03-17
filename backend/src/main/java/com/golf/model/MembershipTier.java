package com.golf.model;

public enum MembershipTier {

    BRONZE(
        "Bronze",
        "Standard membership with access to all courses during regular hours.",
        2,    // max bookings per week
        false // no guest privileges
    ),
    SILVER(
        "Silver",
        "Priority booking with early morning access and reduced green fees.",
        4,
        false
    ),
    GOLD(
        "Gold",
        "Unlimited bookings, all-hours access, guest privileges and pro shop discount.",
        Integer.MAX_VALUE,
        true
    );

    public final String displayName;
    public final String description;
    public final int maxBookingsPerWeek;
    public final boolean guestPrivileges;

    MembershipTier(String displayName, String description, int maxBookingsPerWeek, boolean guestPrivileges) {
        this.displayName       = displayName;
        this.description       = description;
        this.maxBookingsPerWeek = maxBookingsPerWeek;
        this.guestPrivileges   = guestPrivileges;
    }
}
