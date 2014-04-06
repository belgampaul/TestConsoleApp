package be.belgampaul.tennis.domain;

/**
 * User: ikka
 * Date: 4/5/2014
 * Time: 3:06 AM
 */
public class Player extends DomainObject {

  private String lastName;
  private String firstName;

  public Player(String lastName, String firstName) {
    //super(null);
    this.lastName = lastName;
    this.firstName = firstName;
  }

  protected Player(Long id) {
    super(id);
  }

  public String getLastName() {
    return lastName;
  }

  public void setLastName(String lastName) {
    this.lastName = lastName;
  }

  public String getFirstName() {
    return firstName;
  }

  public void setFirstName(String firstName) {
    this.firstName = firstName;
  }


  @Override
  public boolean equals(Object o) {
    if (this == o) {
      return true;
    }
    if (o == null || getClass() != o.getClass()) {
      return false;
    }

    Player player = (Player) o;

    if (!firstName.equals(player.firstName)) {
      return false;
    }
    if (!lastName.equals(player.lastName)) {
      return false;
    }

    return true;
  }

  @Override
  public int hashCode() {
    int result = lastName.hashCode();
    result = 31 * result + firstName.hashCode();
    return result;
  }

  @Override
  public String toString() {
    return "Player{" +
        "lastName='" + lastName + '\'' +
        ", firstName='" + firstName + '\'' +
        '}';
  }


}
