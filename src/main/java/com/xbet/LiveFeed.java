package com.xbet;

import org.codehaus.jackson.annotate.JsonProperty;

import java.util.List;

public class LiveFeed {
  private String error;
  private Number id;
  private boolean success;
  private List<Value> value;

  @JsonProperty("Error")
  public String getError() {
    return this.error;
  }

  public void setError(String error) {
    this.error = error;
  }

  public Number getId() {
    return this.id;
  }

  @JsonProperty("Id")
  public void setId(Number id) {
    this.id = id;
  }


  public boolean getSuccess() {
    return this.success;
  }

  @JsonProperty("Success")
  public void setSuccess(boolean success) {
    this.success = success;
  }

  public List<Value> getValue() {
    return this.value;
  }

  @JsonProperty("Value")
  public void setValue(List<Value> value) {
    this.value = value;
  }
}
